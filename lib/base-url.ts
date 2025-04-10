
export default function getBaseURL(){
    if(typeof window !== "undefined") return ""
    //VERCEL用于
    if(process.env.VERCEL_URL) return `http://${process.env.DOMAIN_URL}`
    ;("http://localhost:3000")
}