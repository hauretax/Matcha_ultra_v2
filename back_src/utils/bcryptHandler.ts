import bcrypt from "bcrypt"

export function encrypt(text: string) {
    const saltRounds = 10
    bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            console.log('Salt: ', salt)
            return bcrypt.hash(text, salt)
        })
        .then(hash => {
            console.log('Hash: ', hash)
        })
        .catch(err => console.error(err.message))
}

export function encryptVerif(text:string,hash:string):Promise<boolean> {
//je pourrais ne pas faire de promesse et simlement attendre ca reponsse mais j ai peur qu en cas derreur je le gere pas ou mal
    return new Promise((resolve, reject) => {
        bcrypt
            .compare(text, hash)
            .then(res => {
                resolve(res)
            })
            .catch(err => reject (err.message))
    })
}