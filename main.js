
class Caroussel{

    /**
     * 
     * @param {HTMLElement} element 
     * @param {Object} options 
     * @param {Object} [options.slidesToScroll = 1] nombre d'elements a faire defiler 
     * @param {Object} [options.slidesVisible = 1] nombre d'elements visibles dans un slide 
     * @param {Boolean} [options.loop = false] doit-on boucler enfin de cycle ?
     * 
     */
    constructor(element, options={}) {
        this.element = element;
        this.options = Object.assign({}, {
            slidesToScroll:1,
            slidesVisible:1,
            loop:false,
        }, options)
       let children = [].slice.call(element.children);
        this.isMobile = true;
        this.currentItem = 0;

        this.root = this.createDivWithClass('caroussel');
        this.container = this.createDivWithClass('caroussel__container');
        
        this.root.appendChild(this.container);
        this.element.appendChild(this.root);
        this.moveCallbacks = [];

        this.items = children.map(child => {
            let item = this.createDivWithClass('caroussel__item');
            item.appendChild(child);
            this.container.appendChild(item);
            return item;
        });

        this.setStyle();
        this.createNavigation();
        this.moveCallbacks.forEach(cb =>cb(0) );
        this.onWindowResize();
        window.addEventListener('resize', this.onWindowResize.bind(this));
    };


    /**
     * Permet d'appliquer les bonnes dimensions aux elements du caroussel
     */
    
    setStyle(){
        let ratio = this.items.length / this.slidesVisible;
        this.container.style.width = (ratio * 100)+'%';
        this.items.forEach(item => {
            item.style.width = (( 100 / this.slidesVisible ) / ratio) + '%';            
        });
    }




    /**
     * Crée et applique les boutons de navigations.
     */
    
    createNavigation(){
     let nextButton = this.createDivWithClass('caroussel__next');
     let prevButton = this.createDivWithClass('caroussel__prev');
     this.root.appendChild(nextButton);
     this.root.appendChild(prevButton);
     nextButton.addEventListener('click', this.next.bind(this));
     prevButton.addEventListener('click', this.prev.bind(this));
     if (this.options.loop === true) {
         return
     }
     this.onMove(index=>{
         if (index === 0) {
             prevButton.classList.add('caroussel__prev--hidden');
         }else{
             prevButton.classList.remove('caroussel__prev--hidden');
        }

         if (this.items[this.currentItem + this.slidesVisible]=== undefined) {
            nextButton.classList.add('caroussel__next--hidden');
        }else{

            nextButton.classList.remove('caroussel__next--hidden');
        }
     });
    }

    next()
    {
      this.gotoItem(this.currentItem + this.slidesToScroll);
    }

    prev()
    {
       this.gotoItem(this.currentItem - this.slidesToScroll);
    }

    onMove(cb){
      this.moveCallbacks.push(cb);
    }

    onWindowResize(){
        let mobile = window.innerWidth < 800;
        if (mobile !== this.isMobile) {
            this.isMobile = mobile;
            this.setStyle();
        this.moveCallbacks.forEach(cb =>cb(this.currentItem) );

        }
    }
    
    /**
     * Permet d'aller a un item particulier
     * @param {number} index 
     */

    gotoItem(index)
    {
        if (index < 0) {
            index = this.items.length - this.options.slidesVisible;
        }else if ( index > this.items.length || (this.items[this.currentItem + this.options.slidesVisible]=== undefined && index > this.currentItem) ){
            index = 0;
        }
       let translateX = index * -100 / this.items.length;
       this.container.style.transform = 'translate3d('+ translateX +'%, 0, 0)';
       this.currentItem = index; 
       this.moveCallbacks.forEach(cb => cb(index));
       
    }

    /*
    * @param {string} classname 
    * @returns {HTMLElement}
    */
    createDivWithClass(classname){
        let div = document.createElement('div');
        div.setAttribute('class', classname);
        return div;
    }

    /**
     * @returns {number}
     */
    get slidesToScroll()
    {
       return this.isMobile ? 1 : this.options.slidesToScroll;
    }


    /**
     * @returns {number}
     */
    get slidesVisible()
    {
       return this.isMobile ? 1 : this.options.slidesVisible;
    }

}




document.addEventListener('DOMContentLoaded', function(){
    new Caroussel(document.querySelector('#caroussel1'), {
        slidesToScroll:2,
        slidesVisible:3,
        loop:true,
        
    });

    new Caroussel(document.querySelector('#caroussel2'), {
        slidesToScroll:2,
        slidesVisible:2,
        
    });

    new Caroussel(document.querySelector('#caroussel3'));
})