import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WaveDivider from "@/components/WaveDivider";
import ScrollReveal from "@/components/ScrollReveal";
import { Phone, Shield, Clock, ChevronRight, Upload, CheckSquare } from "lucide-react";
import { Link } from "react-router-dom";

const subjectOptions = [
  "Demande d'information produit",
  "Question sur une commande",
  "Réclamation qualité",
  "Partenariat professionnel",
  "Autre demande",
];

const profileOptions = [
  "Particulier",
  "Professionnel de santé",
  "Pharmacien",
  "Distributeur",
  "Autre",
];

const civilityOptions = ["M.", "Mme", "Dr", "Pr"];

const countryOptions = [
  "France", "Belgique", "Suisse", "Luxembourg", "Canada", "Maroc", "Tunisie", "Algérie",
];

const phonePrefixes = ["+33", "+32", "+41", "+352", "+1", "+212", "+216", "+213"];

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [fileName, setFileName] = useState("");
  const [email, setEmail] = useState("");
  const [profileType, setProfileType] = useState("");
  const [civility, setCivility] = useState("");
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+33");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [captcha, setCaptcha] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : "");
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!subject) errs.subject = "Veuillez sélectionner un sujet";
    if (!message.trim()) errs.message = "Veuillez saisir votre message";
    if (!email.trim()) errs.email = "Veuillez saisir votre email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format d'email invalide";
    if (!lastName.trim()) errs.lastName = "Veuillez saisir votre nom";
    if (!firstName.trim()) errs.firstName = "Veuillez saisir votre prénom";
    if (!captcha) errs.captcha = "Veuillez confirmer que vous n'êtes pas un robot";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all";
  const selectClass =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all appearance-none";
  const labelClass = "block text-sm font-semibold text-foreground mb-1.5";
  const errorClass = "text-xs text-destructive mt-1";

  return (
    <div className="min-h-screen bg-background font-body">
      <Navbar />

      {/* Breadcrumb + Title */}
      <section className="pt-28 pb-12 bg-muted">
        <div className="container mx-auto px-6">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link to="/" className="hover:text-primary transition-colors">Accueil</Link>
            <ChevronRight size={14} />
            <span className="text-foreground font-medium">Contactez-nous</span>
          </nav>
          <ScrollReveal>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-10 rounded-full bg-primary" />
              <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Contactez-nous
              </h1>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider from="muted" to="background" />

      {/* Instruction */}
      <section className="py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Les champs marqués d'un <span className="text-destructive font-bold">*</span> sont obligatoires. Nous vous répondrons dans les plus brefs délais.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact-form" className="pb-16">
        <div className="container mx-auto px-6">
          {submitted ? (
            <ScrollReveal>
              <div className="max-w-xl mx-auto text-center py-16">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                  <CheckSquare className="text-secondary" size={28} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Message envoyé !</h2>
                <p className="text-muted-foreground">Merci pour votre message. Notre équipe vous répondra sous 48h ouvrées.</p>
              </div>
            </ScrollReveal>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-0 max-w-5xl mx-auto">
                {/* LEFT COLUMN — Message */}
                <div className="space-y-5">
                  {/* Subject */}
                  <div>
                    <label className={labelClass}>Sujet <span className="text-destructive">*</span></label>
                    <select value={subject} onChange={(e) => setSubject(e.target.value)} className={selectClass}>
                      <option value="">— Sélectionnez un sujet —</option>
                      {subjectOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                    {errors.subject && <p className={errorClass}>{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className={labelClass}>Votre message <span className="text-destructive">*</span></label>
                    <textarea
                      rows={7}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Décrivez votre demande en détail…"
                      className={`${inputClass} min-h-[180px] resize-y`}
                    />
                    {errors.message && <p className={errorClass}>{errors.message}</p>}
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className={labelClass}>Pièce jointe</label>
                    <div className="flex items-center gap-3">
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/10 text-primary font-medium text-sm cursor-pointer hover:bg-primary/20 transition-colors">
                        <Upload size={16} />
                        Choisir un fichier
                        <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" />
                      </label>
                      <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {fileName || "Aucun fichier sélectionné"}
                      </span>
                    </div>
                  </div>

                  {/* File format info */}
                  <div className="rounded-lg bg-primary/5 border border-primary/20 p-4 text-sm text-muted-foreground">
                    <p className="font-semibold text-foreground mb-1">Formats acceptés :</p>
                    <p>PDF, JPG, PNG, DOC, DOCX — Taille max : 5 Mo</p>
                  </div>

                  {/* Warning */}
                  <div className="rounded-lg bg-destructive/5 border border-destructive/20 p-4 text-sm text-destructive/80">
                    <p className="font-semibold mb-1">⚠ Données sensibles</p>
                    <p>Ne transmettez jamais de numéros de carte bancaire, mots de passe ou données médicales confidentielles via ce formulaire.</p>
                  </div>
                </div>

                {/* RIGHT COLUMN — Identity */}
                <div className="space-y-5 mt-5 lg:mt-0">
                  {/* Email */}
                  <div>
                    <label className={labelClass}>Email <span className="text-destructive">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" className={inputClass} />
                    {errors.email && <p className={errorClass}>{errors.email}</p>}
                  </div>

                  {/* Profile type */}
                  <div>
                    <label className={labelClass}>Type de profil</label>
                    <select value={profileType} onChange={(e) => setProfileType(e.target.value)} className={selectClass}>
                      <option value="">— Sélectionnez —</option>
                      {profileOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Civility */}
                  <div>
                    <label className={labelClass}>Civilité</label>
                    <select value={civility} onChange={(e) => setCivility(e.target.value)} className={selectClass}>
                      <option value="">— Sélectionnez —</option>
                      {civilityOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Last name + First name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Nom <span className="text-destructive">*</span></label>
                      <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Votre nom" className={inputClass} />
                      {errors.lastName && <p className={errorClass}>{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className={labelClass}>Prénom <span className="text-destructive">*</span></label>
                      <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Votre prénom" className={inputClass} />
                      {errors.firstName && <p className={errorClass}>{errors.firstName}</p>}
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className={labelClass}>Adresse complète</label>
                    <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Numéro et nom de rue" className={inputClass} />
                  </div>

                  {/* Postal + City */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Code postal</label>
                      <input type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} placeholder="75001" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Ville</label>
                      <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Paris" className={inputClass} />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className={labelClass}>Pays</label>
                    <select value={country} onChange={(e) => setCountry(e.target.value)} className={selectClass}>
                      <option value="">— Sélectionnez —</option>
                      {countryOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClass}>Téléphone</label>
                    <div className="grid grid-cols-[100px_1fr] gap-3">
                      <select value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)} className={selectClass}>
                        {phonePrefixes.map((p) => <option key={p} value={p}>{p}</option>)}
                      </select>
                      <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="6 12 34 56 78" className={inputClass} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Anti-spam */}
              <div className="max-w-5xl mx-auto mt-10 pt-8 border-t border-border">
                <h3 className="font-heading text-lg font-bold text-foreground mb-4">Vérification anti-spam</h3>
                <label className="inline-flex items-center gap-3 cursor-pointer select-none rounded-lg border border-border px-5 py-4 bg-muted hover:bg-muted/80 transition-colors">
                  <input
                    type="checkbox"
                    checked={captcha}
                    onChange={(e) => setCaptcha(e.target.checked)}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary/40"
                  />
                  <span className="text-sm font-medium text-foreground">Je ne suis pas un robot</span>
                </label>
                {errors.captcha && <p className={`${errorClass} mt-2`}>{errors.captcha}</p>}
              </div>

              {/* Submit */}
              <div className="max-w-5xl mx-auto mt-8 text-center">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold text-base hover:bg-primary/90 active:scale-95 transition-all shadow-md"
                >
                  Envoyer mon message
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Legal / GDPR */}
      <section className="py-14 bg-muted">
        <div className="container mx-auto px-6 max-w-4xl">
          <ScrollReveal>
            <h3 className="font-heading text-lg font-bold text-foreground mb-6">Protection des données personnelles</h3>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <p>
                Les informations recueillies via ce formulaire font l'objet d'un traitement informatique destiné à répondre à votre demande. Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ces droits, contactez-nous à{" "}
                <a href="mailto:dpo@nutriwell.com" className="text-primary hover:underline">dpo@nutriwell.com</a>.
              </p>
              <p>
                Vos données seront conservées pendant une durée maximale de 3 ans à compter de votre dernière interaction avec Nutriwell, sauf obligation légale contraire. Elles ne seront en aucun cas cédées à des tiers sans votre consentement préalable.
              </p>
              <p>
                Pour plus d'informations sur la manière dont nous traitons vos données, veuillez consulter notre{" "}
                <a href="#" className="text-primary hover:underline">Politique de confidentialité</a>{" "}
                et nos <a href="#" className="text-primary hover:underline">Conditions générales d'utilisation</a>.
              </p>
              <p>
                En soumettant ce formulaire, vous reconnaissez avoir pris connaissance de ces informations et acceptez que vos données soient traitées conformément à notre politique de confidentialité.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <WaveDivider from="muted" to="background" />

      {/* Benefits Strip */}
      <section className="py-14">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            {[
              { icon: Phone, title: "Réponse sous 48h", desc: "Notre équipe s'engage à traiter chaque demande rapidement." },
              { icon: Shield, title: "Données sécurisées", desc: "Vos informations sont protégées conformément au RGPD." },
              { icon: Clock, title: "Support dédié", desc: "Un interlocuteur qualifié pour chaque type de demande." },
            ].map((b, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <b.icon className="text-primary" size={22} />
                  </div>
                  <h4 className="font-heading font-bold text-foreground">{b.title}</h4>
                  <p className="text-sm text-muted-foreground">{b.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
