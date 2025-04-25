import { Card } from "antd"
import Cardtitle from "./Cardtitle"
import Button from "antd/es/button/button"
import { DrumKit } from "@/models/DrumKit";
import Link from "next/link";

interface DrumKitsProps {
    drumKits: DrumKit[];
    handleDelete: (id: string) => void;
    handleOpen: (drumKit: DrumKit) => void;

}

export const DrumKits = ({drumKits, handleDelete,handleOpen} : DrumKitsProps) => {
    return(
        <div>
            {drumKits.map((drumKit: DrumKit) => (
                <Card 
                key={drumKit.id} 
                title = {
                <Cardtitle 
                title={drumKit.title} 
                url={drumKit.url}
                price={drumKit.price}
                />
                }>
                    <p>{drumKit.description}</p>
                    <div>
                        <Button onClick={() => handleOpen(drumKit)} style={{flex:1}}>
                            Edit
                        </Button>
                        <Button onClick={() => handleDelete(drumKit.id)} danger style={{flex:1}}>
                            Delete
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
    )
}