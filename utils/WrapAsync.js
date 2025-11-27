// we will create our custom error handlwere here : 

module.exports = (fn) => {
    return (req,res,next) =>{
        fn(req,res,next).catch(next);
    };
};