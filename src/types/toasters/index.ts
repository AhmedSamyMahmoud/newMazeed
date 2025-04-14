type MessageType = "info" | "error" | "warning" | "success";
export interface IToastMessage {
    type: MessageType
    title: string,
    message: string,
}
