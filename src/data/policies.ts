import { profile } from './profile';

// Shared by the HTML pages and their Markdown representations.
export const policyUpdated = '20 October 2026';

export const privacyPolicy = `## This site

Kartik Labhshetwar runs this personal portfolio, blog, and free newsletter. You can browse without an account. This site does not sell personal data or run advertising.

## Newsletter

[${profile.newsletter}](${profile.newsletterUrl}) is a newsletter hosted on Substack. This site links to Substack and does not collect your email address here. When you follow the link, you leave this site. Substack collects subscription information and handles email delivery under its [privacy policy](https://substack.com/privacy), including its use of cookies and analytics.

As the newsletter publisher, I can access subscriber information that Substack shares with me, including your name and email address. I use this information to publish the newsletter, manage subscriptions, and respond to subscription questions.

Use the unsubscribe link in Substack emails to stop receiving the newsletter. Unsubscribing does not necessarily delete your Substack account or all subscription records. For questions or requests about newsletter data I can access, [contact me](/contact). For information Substack holds for its own purposes, use the privacy controls and contact details in its privacy policy.

## Article views and browser storage

The article counter uses a random first-party cookie named \`reader_id\`, which expires after one year. Upstash Redis stores reader identifiers against article slugs to avoid counting repeat visits. These records currently have no automatic expiry; clearing the cookie does not remove records already stored. The identifier does not include your name or email address and is not used for advertising.

Your theme preference is stored in your browser's local storage. Clearing site data removes this preference and the reader cookie.

## Hosting

Cloudflare hosts the site and processes requests, including IP addresses and request metadata. Hosting and service providers apply their own retention practices to operational records.

## External services

Following links to Substack, GitHub, Cal.com, social profiles, or project sites takes you to services with their own privacy policies.

## Your choices

You can unsubscribe or clear browser storage. To ask about information held about you, request a correction or deletion, or raise a privacy concern, [contact me](/contact). The date above changes when this policy is updated.
`;

export const termsPolicy = `## About these terms

These terms cover Kartik Labhshetwar's personal portfolio, blog, and newsletter. Individual apps, repositories, and external services may have their own terms and licenses.

## Writing and code

You may link to this site and share short excerpts with attribution and a link to the original post. Please ask before republishing full articles. Code in linked repositories is governed by each repository's license. Third-party names, logos, and content belong to their respective owners.

## Using the site

Do not disrupt the site or bypass access controls. Ordinary browsing, linking, and responsible access to public content are welcome.

## Newsletter

[${profile.newsletter}](${profile.newsletterUrl}) is a free newsletter hosted on Substack. Subscribe with an address you control and manage your subscription there. You can unsubscribe using the link in newsletter emails. Substack's [terms](https://substack.com/tos) and [privacy policy](https://substack.com/privacy) apply when you use its service. There is no guaranteed publishing schedule. My [privacy policy](/privacy) explains how this site and the newsletter handle data.

## Accuracy and external links

Posts describe my experience at the time of writing. Software, APIs, and services change, so check examples before using them in your own environment. Content is provided as is, without a guarantee that it is complete, current, or suitable for a particular purpose. Nothing here limits rights or protections that applicable law does not allow to be excluded.

Links to other websites are provided for reference. I do not control their availability, content, or policies.

## Changes and contact

The site and these terms may be updated. The date above records the latest revision. For questions, permissions, or corrections, [contact me](/contact).
`;
