import images from '../images/user_profile_icon/default.png'

export default function Profile() {
    return (
        <img
            src={images}
            alt="Profile Picture"
            style={{ width: "50px", height: "50px" }}
        />
    );
}