'use client';

import Script from 'next/script';

export default function Turnstile({ onVerify }: { onVerify: (token: string) => void }) {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

    if (!siteKey) {
        // For demo/dev if site key is missing, we skip visual captcha but show a message
        return <div className="text-[10px] text-gray-400 text-center">Captcha protected</div>;
    }

    return (
        <div className="flex justify-center my-4">
            <div className="cf-turnstile" data-sitekey={siteKey} data-callback="onTurnstileVerify"></div>
            <Script id="turnstile-callback" strategy="afterInteractive">
                {`
          window.onTurnstileVerify = function(token) {
            window.dispatchEvent(new CustomEvent('turnstile-verified', { detail: token }));
          }
        `}
            </Script>
            <Script
                src="https://challenges.cloudflare.com/turnstile/v0/api.js"
                strategy="afterInteractive"
            />
        </div>
    );
}
