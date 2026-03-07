import os
import httpx
from dotenv import load_dotenv

load_dotenv()


class N8NService:
    def __init__(self):
        self.base_url = os.getenv("N8N_BASE_URL", "").rstrip("/")
        self.api_key = os.getenv("N8N_API_KEY")
        self.webhook_lead_capture = os.getenv("N8N_WEBHOOK_LEAD_CAPTURE")

    def _get_headers(self):
        headers = {}
        if self.api_key:
            headers["X-N8N-API-KEY"] = self.api_key
        return headers

    async def trigger_webhook(self, webhook_url: str, payload: dict):
        """
        Gatilho flexível para qualquer webhook do n8n.
        Pode ser usado para passar dados do Dashboard para os fluxos do n8n.
        """
        if not webhook_url:
            return {"error": "Webhook URL não fornecida."}

        # Se for um path relativo e tivermos a base URL configurada
        if not webhook_url.startswith("http") and self.base_url:
            webhook_url = f"{self.base_url}{webhook_url if webhook_url.startswith('/') else '/' + webhook_url}"

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    webhook_url, json=payload, headers=self._get_headers()
                )
                response.raise_for_status()
                return {
                    "status": "success",
                    "message": "Webhook disparado no n8n com sucesso.",
                    "data": response.json() if response.content else None,
                }
        except httpx.HTTPStatusError as e:
            return {
                "error": f"Erro do n8n: Status {e.response.status_code}",
                "details": e.response.text,
            }
        except Exception as e:
            return {"error": str(e)}

    async def test_connection(self):
        """
        Faz um teste basico na API do n8n, se a URL e Chave API estiverem presentes.
        """
        if not self.base_url or not self.api_key:
            return {"error": "N8N_BASE_URL ou N8N_API_KEY não configurados."}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/api/v1/workflows", headers=self._get_headers()
                )
                response.raise_for_status()
                return {
                    "status": "success",
                    "message": "Conexão com a API do n8n bem-sucedida!",
                }
        except httpx.HTTPStatusError as e:
            return {
                "error": f"Erro de Autorização ou Api do n8n: {e.response.status_code}"
            }
        except Exception as e:
            return {"error": str(e)}


# Singleton instance
n8n_service = N8NService()
