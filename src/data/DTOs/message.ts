
export class Message{

    constructor(init?:Partial<Message>){
        Object.assign(this,init);
    }
    /**
     * Holds the text content of the message
     */
    textContent : string;

    /**
     * The Url of the MessageAsset
     */
    assetContentUrl:string;

    /**
     * The Id of the user who sent the message
     */
    senderId :string;

    receiverId:string


    createdAt :string;
}