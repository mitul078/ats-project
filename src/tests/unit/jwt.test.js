import jwt from "jsonwebtoken"
import { signToken, verifyToken } from "../../utils/jwt"

process.env.JWT_SECRET = "62bdfff3fcf512a51638c582b042244a80350ec283b6e4ba0ab849822678684e"
process.env.JWT_EXPIRES_IN = "1d"

describe("JWT utility", () => {
    it("should sign a payload and return a token string", () => {
        const token = signToken({ id: "123", role: "recruiter" })
        expect(typeof token).toBe("string")
        expect(token.split(".").length).toBe(3)
    })

    it("should verify a valid token and return the original payload", () => {
        const token = signToken({ id: "123", role: "candidate" })
        const decoded = verifyToken(token)

        expect(decoded.id).toBe("123")
        expect(decoded.role).toBe("candidate")
    })

    it("should throw when verifying a malformed token", () => {
        expect(() => verifyToken("not.a.valid.token")).toThrow()
    })

    it("should throw when verifying a token signed with a different secret", () => {
        const forgedToken = jwt.sign({ id: "999" }, "wrong_secret")
        expect(() => verifyToken(forgedToken)).toThrow()
    })
})