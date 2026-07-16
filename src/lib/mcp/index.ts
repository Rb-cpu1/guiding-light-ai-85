import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getProfileTool from "./tools/get-profile";
import getSubscriptionTool from "./tools/get-subscription";
import listConversationTool from "./tools/list-conversation";
import sendMentorMessageTool from "./tools/send-mentor-message";
import getTodayMissionTool from "./tools/get-today-mission";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "mentor-mcp",
  title: "MENTOR",
  version: "0.1.0",
  instructions:
    "Ferramentas do MENTOR — mentor pessoal com sabedoria bíblica, filosofia e psicologia. Use `send_mentor_message` para conversar com o mentor do utilizador autenticado. Use `list_conversation` para ler o histórico, `get_profile` para ver o perfil, `get_today_mission` para a missão diária, e `get_subscription` para o estado da subscrição.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    getProfileTool,
    getSubscriptionTool,
    listConversationTool,
    sendMentorMessageTool,
    getTodayMissionTool,
  ],
});