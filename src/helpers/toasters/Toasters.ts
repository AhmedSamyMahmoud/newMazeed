import { IToastMessage } from "../../types/toasters";

type ToastActions = {
    showToast: (message: IToastMessage) => any;
}
export class Toasters {
    private static instance: Toasters;

    private toasterActions: ToastActions | undefined;
    public static getInstance() {
        if (!this.instance) {
            this.instance = new Toasters();
        }
        return this.instance
    }
    public setToasterActions(toasterActions: any) {
        this.toasterActions = toasterActions;
    }
    get actions() {
        return this.toasterActions;
    }

}