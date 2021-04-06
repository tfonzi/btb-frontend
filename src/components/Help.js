import {useState, useEffect} from 'react'

import "./components.css"

const Help = () => {
    
    const [width, setWidth] = useState(window.innerWidth)

    useEffect(() => {

      //Code for getting screen width
      const resizeWidth = () => {
          setWidth(window.innerWidth)
      }
      window.addEventListener('resize', resizeWidth)
      return _ => {
          window.removeEventListener('resize', resizeWidth)
      }
      
    }, [])
    
     if (width <= 448) { //Mobile
         return (
            <div>
                <h4>0. (Mobile only) Zoom Issues</h4>
                <img className="help_image" src="\resize.jpg"/>
                <p>
                    Due to the nature of making a single page application on mobile, there can be resizing issues if the page is accidentally zoomed in.
                    In order to fix this, just zoom out and refresh the page. 
                </p>
                <p>Don't worry-- refreshing should not delete your Pokemon. :)</p>
                <h4>1. Navigate using the NavBar</h4>
                <img className="help_image" src="\NavBar_mobile.png"/>
                <p>The NavBar has easy access to important parts of the website including your team view, catalogs for Pokemon and Items, and the analysis window.</p>
                <h4>2. Check out the Pokemon and Items Catalogs</h4>
                <img className="help_image" src="\PokemonCatalog_mobile.png"/>
                <p>
                    Tapping on the 'Pokemon' or 'Items' button will bring you to the Pokemon Catalog or Item Catalog respectively. 
                    Here you can tap on a Pokemon or item's image to 'inspect' it, viewing more details and options.
                </p>
                <h4>3. Inspect for more detail and options</h4>
                <img className="help_image" src="\Inspect_1_mobile.png"/>
                <p>Inspecting a Pokemon or Item from the Catalog give you more details about it, as well as options to add it to your team or box.</p>
                <img className="help_image" src="\Inspect_2_mobile.gif"/>
                <p>Inspecting a Pokemon in your team or box gives you even more options, such as giving your pokemon a nickname or choosing their moveset.</p>
                <h4>4. Organize your Pokemon, as well as items, using your Team and Box</h4>
                <p>
                    You can easily transfer Pokemon to your team, box, and in between using the inspect window. 
                    Your team can only hold six Pokemon at a time, but the box can hold as many as you want,
                    so store your main group of Pokemon in your team, and use your box for any that are on stand-by.
                    You can store items in your box as well.
                </p>
                <h4>5. Analyze your team's strengths and weaknesses</h4>
                <img className="help_image" src="\Analysis_mobile.gif"/>
                <p>Using the Analysis window, you can examine your team's details including each Pokemon's offensive and defensive type effectiveness.</p>
                <h4>6. Login to save your setup</h4>
                <img className="help_image" src="\login.png"/>
                <p>Create an account and login to save your progress for usage across devices. Previous work done as a guest can be imported to your account.</p>
            </div>
        )
    }
    else{ //Desktop
        return (
            <div>
                <h4>1. Navigate using the NavBar</h4>
                <img className="help_image" src="\NavBar.png"/>
                <p>The NavBar has easy access to important parts of the website including your team view, catalogs for Pokemon and Items, and the analysis window.</p>
                <h4>2. Check out the Pokemon and Items Catalogs</h4>
                <img className="help_image" src="\PokemonCatalog.png"/>
                <p>
                    Clicking on the 'Pokemon' or 'Items' button will bring you to the Pokemon Catalog or Item Catalog respectively. 
                    Here you can click on a Pokemon or item's image to 'inspect' it, viewing more details and options.
                </p>
                <h4>3. Inspect for more detail and options</h4>
                <img className="help_image" src="\Inspect_1.png"/>
                <p>Inspecting a Pokemon or Item from the Catalog give you more details about it, as well as options to add it to your team or box.</p>
                <img className="help_image" src="\Inspect_2.gif"/>
                <p>Inspecting a Pokemon in your team or box gives you even more options, such as giving your pokemon a nickname or choosing their moveset.</p>
                <h4>4. Organize your Pokemon, as well as items, using your Team and Box</h4>
                <p>
                    You can easily transfer Pokemon to your team, box, and in between using the inspect window. 
                    Your team can only hold six Pokemon at a time, but the box can hold as many as you want,
                    so store your main group of Pokemon in your team, and use your box for any that are on stand-by.
                    You can store items in your box as well.
                </p>
                <img className="help_image" src="\team-box.gif"/>
                <p>On desktop, you can click and drag pokemon between the team and box areas to transfer them.</p>
                <h4>5. Analyze your team's strengths and weaknesses</h4>
                <img className="help_image" src="\Analysis.gif"/>
                <p>Using the Analysis window, you can examine your team's details including each Pokemon's offensive and defensive type effectiveness.</p>
                <h4>6. Login to save your setup</h4>
                <img className="help_image" src="\login.png"/>
                <p>Login in order to save your progress for usage across devices. Previous work done as a guest can be imported to your account.</p>
            </div>
        )
    }
}

export default Help
