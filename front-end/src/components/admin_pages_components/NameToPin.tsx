

interface inputnameProps{
    title: string;
    value: string;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}



const NameToPin: React.FC<inputnameProps> = ({title= "titulo simples", value, handleInputChange}) => {


    return(
        <input 
            type="text" 
            name="name" 
            placeholder={title}
            value={value} 
            onChange={handleInputChange} 
            className="w-full p-2 border rounded"/>
        );
};

    


export default NameToPin;