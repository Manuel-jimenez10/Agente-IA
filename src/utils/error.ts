export async function createError(error: any){

    if(!error.code){
        error = { code: 500, message: "INTERNAL SERVER ERROR" }
    }

    return error

}