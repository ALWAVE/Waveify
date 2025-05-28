import ButtonLogin from "@/component/ButtonLogin";
import PremiumCard from "@/component/PremiumCard";
import { GradientKey } from "@/libs/gradients";
import { Check, X } from "lucide-react";

const premiumPlans = [
    {
        title: "Waveify Premium",
        smallTitle: "1 аккаунт",
        color: "premium_card" as GradientKey,
        description: "Слушайте музыку без рекламы и с загрузкой треков",
        price: 9.99,
        discount: "ЦЕНА ДЛЯ ПОЛЬЗОВАТЕЛЕЙ СНГ ₽399,00",
        features: ["Музыка без рекламы", "Загрузка музыки", "Полный доступ к Waveify", "Доступ к Waveify Studio", "Высокое качество звука", "Доступ к Premium темам", "Уникальное предложение"],
    },
    {
        title: "Duo",
        smallTitle: "2 аккаунта",
        color: "premium_duo_card" as GradientKey,
        description: "2 аккаунта Premium для пары под одной крышей",
        price: 12.99,
        features: ["2 отдельных аккаунта", "Музыка без рекламы", "Групповой плейлист", "Полный доступ к Waveify", "Доступ к Waveify Studio", "Загрузка музыки", "Высокое качество звука", "Доступ к Premium темам", "Скидка"],
        bestValue: true,
        discount: "СКИДКА 35%",
    },
    {
        title: "Artist+",
        smallTitle: "1 аккаунт",
        color: "artist" as GradientKey,
        description: "Инструменты для артистов",
        price: 7.99,
        features: ["Уникальный идентификатор Artist+", "Доступ к премиальным инструментам Артиста", "Загрузка музыки", "Доступ к Premium темам","Доступ к Waveify Studio"],
    },
    {
        title: "Beatmaker+",
        smallTitle: "1 аккаунт",
        color: "beatmaker" as GradientKey,
        description: "Инструменты для битмейкеров",
        price: 7.99,
        features: ["Уникальный идентификатор Beatmaker+", "Доступ к премиальным инструментам Битмейкера", "Загрузка музыки","Доступ к Premium темам", "Доступ к Waveify Studio"],
    },
    {
        title: "Student",
        smallTitle: "1 аккаунт",
        color: "purple" as GradientKey,
        description: "Скидка для студентов вузов",
        price: 4.99,
        features: ["Подтверждение студенческого статуса", "Загрузка музыки", "Музыка без рекламы", "Высокое качество звука","Доступ к Premium темам", "Скидка"],
        discount: "СКИДКА 50%",
    },
];

const featuresList = [
    "Музыка без рекламы",
    "Загрузка музыки",
    "Доступ к Waveify Studio",
    "Полный доступ к Waveify",
    "Высокое качество звука",
    "Доступ к Premium темам",
    "Скидка",
];

const hasPlanFeature = (planTitle: string, feature: string) => {
    const plan = premiumPlans.find(p => p.title === planTitle);
    if (!plan) return false;
    if (feature === "Скидка" && plan.discount) return true;
    return plan.features.includes(feature);
};

const specialOffers = [
    { title: "Waveify Premium", desc1: "Для гуля", desc: "Специально для СНГ", bg: "bg-gradient-to-r from-violet-500 to-pink-300", price: "₽399,00" },
    { title: "Duo", desc1: "Для милой парочки", desc: "Специально для СНГ", bg: "bg-gradient-to-r from-violet-500 to-pink-300", price: "₽599,00" },
    { title: "Student", desc1: "Для умного и образованного", desc: "Для студентов", bg: "bg-gradient-to-r from-violet-500 to-pink-300", price: "₽199,00" },
    { title: "Sponsor", desc1: "Продвижение музыки", desc: "5 продвижений", bg: "bg-gradient-to-r from-red-600 to-rose-700", price: "₽9.999,00" },
    { title: "Boost", desc1: "+1 уровень Waveify", desc: "Уникальное предложение", bg: "bg-gradient-to-r from-green-600 to-emerald-700", price: "₽399,00" },
];

const Premium = () => {
    return (
        <div className="bg-[var(--bgPage)] text-neutral-400 rounded-lg w-full h-full overflow-hidden overflow-y-auto">
            <h1 className="pt-4 text-3xl font-bold text-[var(--text)] mb-2 text-center">Premium планы</h1>
            <p className="text-gray-400 mb-8 text-center">Выберите план, который подходит именно вам</p>

            <div className="z-10 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {premiumPlans.map((plan, index) => (
                    <PremiumCard key={index} {...plan} />
                ))}
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-bold text-white mb-8 text-center">Сравнение премиум-планов</h2>
                <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                        <div className="grid grid-cols-6 bg-neutral-800 rounded-t-lg">
                            <div className="p-4 text-left text-white font-medium">Возможности</div>
                            {premiumPlans.map((plan, index) => (
                                <div key={index} className={`p-4 text-center border-l border-gray-700 text-white ${plan.bestValue ? 'bg-green-900' : ''}`}>
                                    {plan.bestValue && <div className="text-xs font-semibold text-green-300 mb-1">ЛУЧШИЙ ВЫБОР</div>}
                                    <div className="font-medium">{plan.title}</div>
                                    <div className="text-sm font-normal text-neutral-400">${plan.price}/мес</div>
                                </div>
                            ))}
                        </div>

                        {featuresList.map((feature, idx) => (
                            <div key={idx} className={`grid grid-cols-6 ${idx % 2 === 0 ? 'bg-neutral-900' : 'bg-neutral-800'}`}>
                                <div className="p-4 border-t border-neutral-600">{feature}</div>
                                {premiumPlans.map((plan, planIdx) => (
                                    <div key={`${planIdx}-${idx}`} className="p-4 border-t border-l border-neutral-700 flex justify-center items-center">
                                        {hasPlanFeature(plan.title, feature) ? <Check className="h-5 w-5 text-green-500" /> : <X className="h-5 w-5 text-neutral-500" />}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <h1 className="pt-8 text-3xl font-bold text-[var(--text)] mb-4 text-center">Специальные предложения</h1>
                <div className="flex gap-4 overflow-x-auto px-4 py-2">
                    {specialOffers.map((offer, index) => (
                        <div key={index} className="relative overflow-hidden min-w-[250px] w-full max-w-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-0 rounded-xl flex flex-col">
                            <div className={`absolute inset-0 opacity-95 ${offer.bg}`}></div>
                            <div className="relative p-6 text-white z-10 flex flex-col flex-grow">
                                <h3 className="text-xl font-bold tracking-tight mb-1">{offer.title}</h3>
                                <p className="text-sm text-gray-200 opacity-80">{offer.desc}</p>
                                <p className="mt-3 text-sm text-gray-100">{offer.desc1}</p>
                                <div className="mt-4">
                                    <span className="text-2xl font-bold">{offer.price}</span>
                                    <span className="text-sm text-gray-200">/мес</span>
                                    <ButtonLogin className="mt-2 w-full bg-white hover:bg-white/90 text-black font-semibold border-0">
                                        Подробнее
                                    </ButtonLogin>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <h1 className="pt-10 text-3xl font-bold text-[var(--text)] mb-6 text-center">Подробно про Premium планы</h1>
            </div>
        </div>
    );
};

export default Premium;
