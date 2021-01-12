import {Link} from 'react-router-dom';

export default function FirstPage(){
    return (
      <div>
       <section id="hero" className="d-flex align-items-center">
         <div className="container position-relative text-center text-lg-left" data-aos="zoom-in" data-aos-delay={100}>
        
           <div className="row" style={{position: "center"}}>
             <div className="col-lg-8">
               <h1>Welcome to <span>Little Buddy</span></h1>
               <h2>A smart plants juornal.</h2>
               <div className="btns">
                 <Link to="/login" className="btn-menu animated fadeInUp scrollto">Log in</Link>
                 <Link to="/register" className="btn-book animated fadeInUp scrollto">Register</Link>
               </div>
             </div>
           
           </div>
         </div>
     </section>
    </div>
     );
   }