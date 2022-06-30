import { StyledLink } from "baseui/link";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Footer = () => { 
    var history = useHistory();
 return (
    <div className='h-20 border bg-black absolute w-full flex bottom-0 shadow-xl align-center text-center flex-col justify-center'>
      <div style={{color: "white"}}>CES'EAT - Tout droit réservé</div>
      <StyledLink style={{color: "white"}} href="" onClick={(e) => {
                history.push('/users/legal-mentions');
              }}>
                Mentions Légales
        </StyledLink>
    </div>
  );
}
  
  export default Footer;
  