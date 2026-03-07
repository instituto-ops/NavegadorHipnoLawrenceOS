import asyncio
import chromadb
from typing import Any

# Adjust imports based on the actual path context if necessary
from lam.neuro_engine import NeuroInsight

class LTMDatabase:
    """Long-Term Memory Database using ChromaDB."""
    def __init__(self, db_path: str = "./chroma_db"):
        self.db_path = db_path
        # PersistentClient avoids memory loss between restarts
        self.client = chromadb.PersistentClient(path=db_path)
        # Create or get collection for insights
        self.collection = self.client.get_or_create_collection(
            name="neuro_insights",
            metadata={"hnsw:space": "cosine"}
        )

    def _store_insight_sync(self, insight: NeuroInsight) -> bool:
        """Synchronous underlying function to store insight in ChromaDB."""
        try:
            # We construct a document string that represents the semantic meaning
            document = f"[{insight.category.value}] {insight.title}: {insight.description}"
            if insight.actionable_items:
                document += f" Actions: {', '.join(insight.actionable_items)}"

            # Serialize the entire object to store as metadata for retrieval
            # Keep flat dict for metadata in Chroma
            metadata = {
                "category": insight.category.value,
                "source_id": insight.source_id,
                "confidence_score": insight.confidence_score,
                "created_at": insight.created_at.isoformat(),
                "full_json": insight.model_dump_json()
            }

            self.collection.add(
                ids=[insight.id],
                documents=[document],
                metadatas=[metadata]
            )
            return True
        except Exception as e:
            print(f"Failed to store insight in LTM: {e}")
            return False

    async def store_insight(self, insight: NeuroInsight) -> bool:
        """Asynchronously store a NeuroInsight into the Vector DB without blocking the event loop."""
        return await asyncio.to_thread(self._store_insight_sync, insight)

    def _query_insights_sync(self, query_text: str, n_results: int = 5) -> Any:
        """Synchronously query the vector DB."""
        try:
            results = self.collection.query(
                query_texts=[query_text],
                n_results=n_results
            )
            return results
        except Exception as e:
            print(f"Failed to query LTM: {e}")
            return []

    async def query_insights(self, query_text: str, n_results: int = 5) -> Any:
        """Asynchronously query the vector DB."""
        return await asyncio.to_thread(self._query_insights_sync, query_text, n_results)

# Global instance
ltm_db = LTMDatabase()

if __name__ == "__main__":
    async def test():
        import uuid
        from lam.neuro_engine import InsightCategory

        insight = NeuroInsight(
            id=str(uuid.uuid4()),
            source_id="src-123",
            category=InsightCategory.PRIORITY,
            title="Test Insight",
            description="This is a test to verify ChromaDB storage.",
            actionable_items=["Do the thing"],
            confidence_score=0.95
        )

        db = LTMDatabase("./test_db")
        success = await db.store_insight(insight)
        print(f"Storage successful: {success}")

        results = await db.query_insights("test")
        print("Query Results:", results)

    asyncio.run(test())
