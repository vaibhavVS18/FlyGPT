import "dotenv/config";

const getOpenAiApiResponse = async(message)=>{
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",  // or "gpt-4", "gpt-4o", etc.
            messages: [
            { role: "user",
            //   content: req.body.message,
            content: message,
            }]
        })
    };

    try{
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions",options);
        const data = await response.json();
        console.log(data.choices[0].message.content);
        // res.send(data.choices[0].message.content);
        return data.choices[0].message.content;
    } catch (err) {
        console.error(err);
    }
}

export default getOpenAiApiResponse;