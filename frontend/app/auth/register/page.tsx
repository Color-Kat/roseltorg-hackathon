import { AuthForm } from "@/pagez/auth";
import { AuthGuard } from "@/entities/auth";

export const metadata = { title: "Register" };

export default function RegisterPage() {
    return (
        <AuthGuard guestOnly>
            <AuthForm mode="register" />
        </AuthGuard>
    );
}
