import Link from "next/link";


interface CardtitleProps {
    title: string;
    url: string;
    price: number;
}

const Cardtitle = ({ title, url, price }: CardtitleProps) => {
    return (
        <div >
            <div style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",

            }}>
                <p>
                    {title}
                </p>
                <Link href={url}>
                    Ссылка на драм кит
                </Link>
                <p>
                    {price} Рублей
                </p>
            </div>

        </div>


    )
}

export default Cardtitle;