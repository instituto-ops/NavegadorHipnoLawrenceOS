with open("apps/frontend/src/components/ActionReviewCard.tsx", "r") as f:
    content = f.read()

content = content.replace("    } catch (e) {", "    } catch (e: unknown) {")
content = content.replace("    } catch (e: unknown) {", "    } catch (_e) {")

with open("apps/frontend/src/components/ActionReviewCard.tsx", "w") as f:
    f.write(content)

with open("apps/frontend/src/hooks/useAgentSocket.ts", "r") as f:
    content = f.read()

content = content.replace("plan?: any;", "plan?: unknown;")
content = content.replace("const [hitlRequest, setHitlRequest] = useState<{thread_id: string, plan: any} | null>(null);", "const [hitlRequest, setHitlRequest] = useState<{thread_id: string, plan: unknown} | null>(null);")
content = content.replace("const sendHitlResponse = useCallback((thread_id: string, action: \"approve\" | \"reject\" | \"edit\", plan?: any) => {", "const sendHitlResponse = useCallback((thread_id: string, action: \"approve\" | \"reject\" | \"edit\", plan?: unknown) => {")

with open("apps/frontend/src/hooks/useAgentSocket.ts", "w") as f:
    f.write(content)
