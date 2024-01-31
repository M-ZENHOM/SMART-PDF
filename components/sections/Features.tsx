import React from 'react'
import { Icons } from '../Icons';
import { Card, CardHeader, CardTitle, CardDescription } from '../ui/card';

export default function Features() {
    return (
        <div className="py-32 flex flex-wrap justify-between space-y-5 px-8 md:space-y-0 md:px-0 ">
            {content.map((item) => (
                <Card key={item.title} className="w-[350px] ">
                    <CardHeader className="space-y-5">
                        {item.icon}
                        <CardTitle>{item.title}</CardTitle>
                        <CardDescription className="leading-6 text-balance">{item.description}</CardDescription>
                    </CardHeader>
                </Card>
            ))}
        </div>
    )
}


const content = [
    {
        title: "Insightful Conversations",
        icon: <Icons.Book className="w-20 h-20" />,
        description:
            `Unleash the chat power in your documents! Turn them into friendly Chatbot's,ready to share knowledge and insights.
        Just upload and voila, your documents aren't just smart, they're your new best friends. Dive in, engage, and enjoy your most interactive reading experience yet!`,
    },
    {
        title: "Save Time",
        icon: <Icons.clock className="w-20 h-20" />,
        description:
            "AskYourPDF brings the magic of AI to your fingertips! Dive into smart navigation, no more endless scrolling or page skimming. Your documents transform into interactive buddies, ready to help you understand and engage in an instant!",
    },
    {
        title: "Learn Playfully",
        icon: <Icons.learn className="w-20 h-20" />,
        description:
            "Our AI-powered chat system not only provides you with accurate information but also fosters an enjoyable learning environment that keeps you coming back for more.",
    },

];