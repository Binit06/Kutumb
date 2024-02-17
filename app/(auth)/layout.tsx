const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return(
        <div className="bg-neutral-300 h-[100vh] grid place-content-center">
            {children}
        </div>
    )
}

export default AuthLayout