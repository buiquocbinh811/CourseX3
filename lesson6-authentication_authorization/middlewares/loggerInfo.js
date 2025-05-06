export default function loggerInfo(req, res, next) {
    let date = new Date()
    console.log("Thời gian gửi request " + date.getDate())

    next()
}