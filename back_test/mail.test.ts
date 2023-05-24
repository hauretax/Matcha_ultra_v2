import sendEmail from "../back_src/utils/sendMail"

describe('just mail', () => {

    it('jsut mail', async ()=>{ 
        await sendEmail().catch(console.error);
    })
})