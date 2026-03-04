import asyncio
import httpx
import json

async def test_seo_and_wp():
    base_url = "http://localhost:8000"
    
    print("\n--- 🧪 Teste 1: PageSpeed Insights API ---")
    url_to_test = "https://hipnolawrence.com"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.get(f"{base_url}/api/analytics/pagespeed?url={url_to_test}&strategy=MOBILE")
            if resp.status_code == 200:
                print("✅ PageSpeed status: 200 OK")
                print(f"📊 Scores: {json.dumps(resp.json().get('scores'), indent=2)}")
            else:
                print(f"❌ PageSpeed error: {resp.status_code}")
                # print(resp.text)
    except Exception as e:
        print(f"⚠️ Erro ao conectar com PageSpeed: {e}")

    print("\n--- 🧪 Teste 2: WordPress Post Creation ---")
    payload = {
        "title": "Teste Automático via NeuroStrategy OS",
        "content": "Este é um post de teste criado para validar o motor de publicação."
    }
    # Using params as main.py uses query params for title/content in the new endpoint
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # Check the actual endpoint signature in main.py updates
            resp = await client.post(f"{base_url}/api/wordpress/publish", params=payload)
            if resp.status_code == 200:
                data = resp.json()
                if "error" in data:
                    print(f"❌ WordPress error from API: {data['error']}")
                else:
                    print(f"✅ Post criado com sucesso! ID: {data.get('id')}")
            else:
                print(f"❌ WordPress endpoint error: {resp.status_code}")
                # print(resp.text)
    except Exception as e:
        print(f"⚠️ Erro ao conectar com WordPress: {e}")

if __name__ == "__main__":
    # Ensure the backend is running before executing this
    print("Iniciando bateria de testes do motor NeuroStrategy...")
    asyncio.run(test_seo_and_wp())
    print("\n--- ✅ Testes finalizados ---")
