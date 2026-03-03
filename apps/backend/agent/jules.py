import sys
import argparse
import asyncio
import os
import json
from dotenv import load_dotenv

# We import the orchestrator to simulate the assistant's behavior
try:
    from lam.orchestrator import LamOrchestrator
except ImportError:
    # Handle pathing if needed
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
    from lam.orchestrator import LamOrchestrator

load_dotenv()

async def run_test_loop(goal: str, max_retries: int = 5):
    """
    Jules Test Loop: Runs consecutive tests for a goal until success or max retries.
    """
    print(f"Jules engineering agent: Starting self-correction loop for goal: '{goal}'")
    orchestrator = LamOrchestrator(headless=True)
    await orchestrator.setup()
    
    success = False
    for attempt in range(1, max_retries + 1):
        print(f"\nAttempt #{attempt}...")
        try:
            # We run the task
            result = await orchestrator.run_task(task=goal, thread_id=f"test_loop_{attempt}")
            
            # Simple success heuristic: check if 'status' is completed and no 'Error' in execution_results
            execution_results = result.get("execution_results", [])
            has_error = any("Error" in str(res) for res in execution_results)
            
            if result.get("status") == "completed" and not has_error:
                print(f"Goal achieved on attempt #{attempt}!")
                success = True
                break
            else:
                print(f"Attempt #{attempt} failed or was incomplete. Correcting approach...")
                # Here we could inject a "fix" into the next run's memory or context
        except Exception as e:
            print(f"Critical error during attempt #{attempt}: {e}")
        
        # Wait a bit before retrying
        await asyncio.sleep(2)
    
    await orchestrator.close()
    if success:
        print("\n[SUCCESS] Jules has confirmed the assistant is now providing a good response.")
    else:
        print("\n[FAILURE] Jules could not obtain a good response after maximum retries.")

def main():
    parser = argparse.ArgumentParser(description="Jules Engineering CLI")
    parser.add_argument("--help", action="store_true", help="Show help")
    subparsers = parser.add_subparsers(dest="command")
    
    # Subcommand: test-loop
    test_parser = subparsers.add_parser("test-loop", help="Perform consecutive tests until success")
    test_parser.add_argument("goal", type=str, help="The goal to test")
    test_parser.add_argument("--retries", type=int, default=5, help="Max number of retries")
    
    args = parser.parse_args()
    
    if args.help or not args.command:
        parser.print_help()
        return

    if args.command == "test-loop":
        asyncio.run(run_test_loop(args.goal, args.retries))

if __name__ == "__main__":
    main()
