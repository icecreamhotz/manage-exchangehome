export const validateCondoForm = (count, errorClass, name, inputname, value) => {
    const newArr = errorClass.slice()

        if(name === inputname) {
            if(value !==  "") {
                newArr[count] = false
                return newArr
            } else {
                newArr[count] = true
                return newArr
            }
        }
   
    return newArr
}
