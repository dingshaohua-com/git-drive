type GetLoginType = (params: any) => 'account' | 'email' | 'phone' | undefined;
export const getLoginType: GetLoginType = (params)=>{
    if(params.account){
        return 'account';
    }else if(params.email){
        return 'email';
    }else if(params.phone){
        return 'phone';
    }
}