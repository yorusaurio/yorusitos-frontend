import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
    </div>
  );
}
