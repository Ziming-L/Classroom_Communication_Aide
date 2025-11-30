import defaultImage from '../images/user_profile_icon/default_user.png';

export default function Profile({image = defaultImage, color = '#add8e6'}) {
    return (
        <div
            style={{
                width: "50px",
                height: "50px",
                backgroundColor: color,
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                border: "2px solid black"
            }}
        >
            <img
                src={image}
                alt="Profile Picture"
                style={{
                    width: "80%",
                    height: "80%"
                }}
            />
        </div>
    );
}