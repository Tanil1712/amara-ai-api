export type AmaraIntent =
  | "GREETING"
  | "HOMEWORK_HELP"
  | "STUDY_TIPS"
  | "MOTIVATION"
  | "DISCOVER_HELP"
  | "UNKNOWN";

export type AmaraContext = {
  name?: string;
  form?: string;
  subjects?: string[];
  contextText?: string;
};

export type AmaraMessage = {
  id: string;
  sender: "user" | "amara";
  text: string;
};