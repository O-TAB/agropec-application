import Logo from '../assets/Logo_Agropec.png'

type LogoProps = {
    classname?: string;
    alt?: string;
}

export default function LogoComponent({ classname = 'h-8 w-auto ' , alt='logo' }: LogoProps) {
    return (<img src={Logo} className={classname} alt={alt} />)}