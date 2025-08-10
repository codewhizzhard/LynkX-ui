import cctpData from "../../service/cctpAxios";

export const retrieveMsg = async(sourceDomainId, hash) => {
    console.log("retrieving messages")
    while (true) {
        try {
            const msg = await cctpData.get(`cctpv2/getMsg/${sourceDomainId}/${hash}`)
            console.log("msgdata:", msg)
            if (msg?.data?.data.messages?.[0]?.status === "complete") {
                console.log("Attestation retrieved!", msg);
                return msg.data?.data.messages[0];
            }
            
        console.log("⏳ Still waiting for attestation...");
        } catch (err) {
            console.error("❌ Error polling message:", err.message);
    }
        await new Promise((resolve) => setTimeout(resolve, 5000)) 
    }
    
} 