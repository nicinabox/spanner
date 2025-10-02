import { withSession } from '../src/utils/session';

const Logout = () => null;

export const getServerSideProps = withSession(async ({ req }) => {
    req.session.destroy();

    return {
        redirect: {
            destination: '/',
            permanent: false,
        },
    };
});

export default Logout;
