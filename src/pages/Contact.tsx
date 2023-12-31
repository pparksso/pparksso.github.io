import { useState, useRef, FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import MainLayout from '@/layouts/MainLayout';
import Title from '@/components/Card/Title';
import ContactInput from '@/components/ContactInput';
import Modal from '@/components/common/Modal';
import { PEER_COMMON, TEXTAREA_LABEL_PEER } from '@/assets/styles/_var';
import '@/assets/styles/custom.css';
import img from '@/assets/images/img_original.jpg';
import Loading from '@/components/common/Loading';

const Contact = () => {
    const form = useRef<HTMLFormElement>(null);
    const [messageFocus, setMessageFocus] = useState(false);
    const [modalText, setModalText] = useState('');
    const [loading, setLoading] = useState(false);

    const modalRef = useRef<{ openModal: () => void } | null>(null);

    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (form.current) {
            setLoading(true);
            emailjs
                .sendForm(
                    import.meta.env.VITE_SERVICE_ID,
                    import.meta.env.VITE_TEMPLATE_ID,
                    form.current,
                    import.meta.env.VITE_PUBLIC_KEY,
                )
                .then((res) => {
                    if (res.status === 200) {
                        setLoading(false);
                        setModalText('메일 감사합니다! 바로 연락 드리겠습니다😀');
                        modalRef.current?.openModal();
                    } else {
                        setLoading(false);
                        setModalText('메일 전송에 실패하였습니다. 다시 시도해주세요.');
                        modalRef.current?.openModal();
                    }
                })
                .catch(() => {
                    setModalText('메일 전송에 실패하였습니다. 다시 시도해주세요.');
                    modalRef.current?.openModal();
                });
        } else {
            setModalText('메일 전송에 실패하였습니다. 다시 시도해주세요.');
            modalRef.current?.openModal();
        }
    };

    window.scrollTo({ top: 0, behavior: 'smooth' });
    return (
        <>
            <MainLayout>
                <div className="relative w-[90%] xl:w-3/5 py-12 text-black">
                    <div className="absolute top-[3rem] -translate-x-1/2 bg-white left-1/2 px-2 text-center">
                        <Title>Contact me!</Title>
                    </div>
                    <div className="border mt-[1rem] shadow-lg rounded-md px-10 py-14 flex flex-col md:flex-row items-center md:items-start h-full">
                        <div className="w-4/5 mb-5 overflow-hidden rounded-full md:mb-0 md:pr-3 md:rounded-none md:w-1/2 opacity-90">
                            <img
                                src={img}
                                alt=""
                                className="object-cover md:rounded-md aspect-square md:aspect-auto"
                            />
                        </div>
                        <form
                            ref={form}
                            onSubmit={sendEmail}
                            className="flex flex-col w-full md:h-full md:w-1/2 md:pl-3"
                        >
                            <ContactInput type="text" id="name" label="Name" />
                            <ContactInput type="text" id="email" label="Email" />
                            <div
                                className={`relative flex-grow px-6 md:px-12 pt-6 pb-2 overflow-y-hidden rounded-md bg-emerald bg-opacity-10 ${
                                    messageFocus && 'border-emerald border-2'
                                } `}
                            >
                                <textarea
                                    id="message"
                                    placeholder=""
                                    name="message"
                                    required
                                    className={`resize-none w-full bg-transparent outline-none text-base peer hide-scrollbar h-24 md:h-auto`}
                                    onFocus={() => setMessageFocus(true)}
                                    onBlur={() => setMessageFocus(false)}
                                ></textarea>
                                <label
                                    htmlFor="message"
                                    className={`left-6 md:left-12 top-6 ${PEER_COMMON} ${TEXTAREA_LABEL_PEER}`}
                                >
                                    Message
                                </label>
                            </div>
                            <div className="mt-3 text-center">
                                <button className="w-1/2 py-2 font-bold text-white transition-all duration-200 bg-black border-2 rounded-md hover:border-emerald hover:bg-opacity-10 hover:bg-emerald hover:text-black">
                                    SEND
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </MainLayout>
            <Modal text={modalText} ref={modalRef} />
            {loading && <Loading />}
        </>
    );
};

export default Contact;
