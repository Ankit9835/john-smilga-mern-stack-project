const notFoundMiddleware = (req,res) => {
    res.status(404).send('Route does not exists')
}

export default notFoundMiddleware