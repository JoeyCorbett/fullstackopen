const Notification = ({ successMsg, errorMsg }) => {
    if (!successMsg && !errorMsg) return null

    const message = successMsg ? successMsg : errorMsg;
    
    const notificationClass = successMsg
        ? 'notification notification-success'
        : 'notification notification-error'

    return (
        <div className={notificationClass}>
            {message}
        </div>
    )
}

export default Notification