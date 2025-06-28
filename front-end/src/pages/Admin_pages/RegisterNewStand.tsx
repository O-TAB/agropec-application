import { useEffect, useState } from "react";
import { emptypoint, point, ResponsePoint } from "../../data/ObjectStructures";
import { useAuth } from "../../context/AuthContext";
import { getFirstMapId, getMyObjectsStands, getMypoints } from "../../functions/persistence/api";
import { useNavigate } from "react-router-dom";



const RegisterNewStand: React.FC = () => {
    const { logout } = useAuth();
    const [idmap, setidmap] =useState<string>('');
    const [newPoint, setNewPoint] = useState<point | ResponsePoint>(emptypoint);
    const [itemSelected, setPointSelected] = useState<ResponsePoint | null>(null);
    
    const [allpoints, setPoints] = useState< ResponsePoint[]>([]);
    const navigate = useNavigate();

    const loadData = async () => {
        if (idmap) {
            const datapoint = await getMypoints(idmap);
            const datastands = await getMyObjectsStands();
            setPoints(datapoint);
        }
    };

    useEffect(() => {
        getFirstMapId().then((idmap) => {
              if (idmap) {
                setidmap(idmap);
              }else{
                navigate('/uploadmap');
              }
            });  
      }, [navigate]);
    
      useEffect(() => {
        loadData();
      }, [idmap]);
    return(<h1></h1>

    );
}

export default RegisterNewStand;