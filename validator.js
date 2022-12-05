class Validator {
    constructor(config) {
        this.elementConfig = config
        this.errors = {}

        this.generateErrorsObject()
        this.inputListener()
    }

    generateErrorsObject() {
        for(let field in this.elementConfig) {
            this.errors[field] = []
        }
    }

    inputListener() {
        for(let field in this.elementConfig) {
            let el = document.querySelector(`input[name="${field}"]`)

            el.addEventListener('input', this.validate.bind(this))
        }
    }

    validate(e) {
        let elFields = this.elementConfig

        let field = e.target
        let fieldName = field.getAttribute('name')
        let fieldValue = field.value

        this.errors[fieldName] = []

        if (elFields[fieldName].required) {
            if (fieldValue === '') {
                this.errors[fieldName].push('Polje je prazno')
                field.classList.add('border-danger')
            } else {
                field.classList.remove('border-danger')
                field.classList.add('border-success')
            }
        }

        if(elFields[fieldName].email) {
            if (!this.validateEmail(fieldValue)) {
                this.errors[fieldName].push('Neispravna email adresa')
                field.classList.add('border-danger')
            } else {
                field.classList.remove('border-danger')
                field.classList.add('border-success')
            }
        }

        
        if (fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
            this.errors[fieldName].push(`Polje mora imati minimalno ${elFields[fieldName].minlength} i maksimalno ${elFields[fieldName].maxlength} karaktera`)
            field.classList.add('border-danger')
        }

        if (elFields[fieldName].matching) {
            let matchingEl = document.querySelector(`input[name="${elFields[fieldName].matching}"]`)

            if (fieldValue !== matchingEl.value) {
                this.errors[fieldName].push('Lozinke se ne poklapaju')
            }

            if (fieldValue !== matchingEl.value || fieldValue.length < elFields[fieldName].minlength || fieldValue.length > elFields[fieldName].maxlength) {
                field.classList.add('border-danger')
                matchingEl.classList.add('border-danger')
            } else {
                field.classList.remove('border-danger')
                field.classList.add('border-success')
                matchingEl.classList.remove('border-danger')
                matchingEl.classList.add('border-success')
            }

            if (this.errors[fieldName].length === 0) {
                this.errors[fieldName] = []
                this.errors[elFields[fieldName].matching] = []
            } 
        }

        this.populateErrors(this.errors)
    }

    populateErrors(errors){
        for(const elem of document.querySelectorAll('ul')) {
            elem.remove()
        } 

        for(let key of Object.keys(errors)) {
            let parentElement = document.querySelector(`input[name="${key}"]`).parentElement
            let child = document.createElement('ul')
            parentElement.appendChild(child)

            errors[key].forEach(error => {
                let li = document.createElement('li')
                li.innerText = error

                child.appendChild(li)
                li.classList.add('text-danger')
            });
        }
    }
    

    validateEmail(email) {
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
            
        return false;
    }

}
    
