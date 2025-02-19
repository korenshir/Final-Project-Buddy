import {Link} from 'react-router-dom'

export default function Footer(){
    return(

            <footer id="footer">
             
              <div className="container">
                <div className="copyright">
                  © Copyright <strong><span>Little Buddy</span></strong>. All Rights Reserved
                </div>
                <div className="credits">
                  {/* All the links in the footer should remain intact. */}
                  {/* You can delete the links only if you purchased the pro version. */}
                  {/* Licensing information: https://bootstrapmade.com/license/ */}
                  {/* Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/restaurantly-restaurant-template/ */}
                   <Link to="/aboutus">About us</Link>
                </div>
              </div>
            </footer>
          );
        }
      
