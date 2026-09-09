export type todo = {
    id:string,
    title:string,
    is_completed:boolean,
    created_at:Date,
    updated_at:Date,
    /**
     * Can be empty string for no description
     */
    description:string,
}