import { AuthForm } from "@/pagez/auth";
import { AuthGuard } from "@/entities/auth";

export const metadata = { title: "Log in" };

export default function LoginPage() {
    return (
        <AuthGuard guestOnly>
            <AuthForm mode="login" />
        </AuthGuard>
    );
}
