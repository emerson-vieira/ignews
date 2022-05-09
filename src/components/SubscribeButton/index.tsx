import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "../../service/api";
import { getStripeJs } from "../../service/stripe-js";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
    priceId: string;
}
export function SubscribeButton({}: SubscribeButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();

    async function handleSubscribeButton() {
        if(!session) {
            signIn('github');
            return;
        }

        if(session.userActiveSubscription) {
            router.push("/posts");
            return;
        }

        try {
            const response = await api.post("/subscribe");
            const { sessionId } = response.data;
            const stripe = await getStripeJs();

            await stripe.redirectToCheckout({ sessionId });
        } catch (err) {
            alert(err.message);
        }
    }
    return (
        <button
            type="button"
            className={styles.subscribeButton}
            onClick={handleSubscribeButton}
        >
            Subscribe now
        </button>
    )
}