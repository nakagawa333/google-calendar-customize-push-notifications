export const getServiceAccount = () => {
    let env = process.env;

    let firebasePrivateKey:string = env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY ? env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : "";
    const serviceAccount:any = {
        "type": "service_account",
        "project_id": env.NEXT_PUBLIC_FIREBASE_PROJECTID,
        "private_key_id": env.NEXT_PUBLIC_FIREBASE_PROJECTKEYID,
        "private_key": firebasePrivateKey,
        "client_email": env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
        "client_id": env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
        "universe_domain": "googleapis.com"
    }
    return serviceAccount;
}