import PikachuCanvas from "../canvas/Pikachu"
import { styles } from "../constants"

const Header = () => {
  return (
    <section className="relative w-full h-[50vh] mx-auto">
        
        <div className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto
        flex flex-row items-start gap-5`}>
            <div className="flex flex-col justify-center items-center mt-5">
                
                

            </div>
            <div className="sm:flex items-center justify-center">
                <h1 className={`${styles.sectionHeadText}`}>
                    Welcome to the Greatest Poke Wiki <br /><span className={`${styles.heroSubText}`}> Say hi! to pikachu</span>
                </h1>
                <PikachuCanvas/>
            </div>

        </div>
        
    </section>
  )
}

export default Header