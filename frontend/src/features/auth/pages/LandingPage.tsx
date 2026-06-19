import ApartmentIcon from "@mui/icons-material/Apartment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DatasetLinkedIcon from "@mui/icons-material/DatasetLinked";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import GoogleIcon from "@mui/icons-material/Google";
import GroupsIcon from "@mui/icons-material/Groups";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import SecurityIcon from "@mui/icons-material/Security";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Stack,
  Typography,
  alpha,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import { type ReactNode, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../app/store/authStore";
import { getDashboardPath } from "../../../shared/utils/getDashboardPath";
import { SEO } from "../../../shared/components/SEO";
import { ROUTES } from "../../../shared/constants/routes";
import { startGoogleOAuth } from "../constants/oauth";

const trustIndicators = [
  "AI Candidate Screening",
  "Smart Resume Analysis",
  "Faster Hiring Decisions",
  "Job Matching Intelligence",
];

const heroStats = [
  "10,000+ Applications Processed",
  "95% Faster Screening",
  "AI Interview Assistant",
];

const journeys = [
  {
    title: "Candidate",
    icon: <PersonAddIcon />,
    points: ["Create Profile", "Upload Resume", "Find Jobs", "Track Applications"],
    cta: "Find Jobs",
    to: ROUTES.REGISTER,
  },
  {
    title: "Recruiter",
    icon: <BusinessCenterIcon />,
    points: ["Post Jobs", "Screen Candidates", "AI Ranking", "Manage Hiring"],
    cta: "Hire Talent",
    to: ROUTES.REGISTER,
  },
];

const features = [
  {
    title: "AI Resume Intelligence",
    description: "Analyze resumes using AI and identify top talent instantly.",
    icon: <FactCheckIcon />,
  },
  {
    title: "Smart Job Matching",
    description: "Recommend jobs and candidates using intelligent matching.",
    icon: <PsychologyIcon />,
  },
  {
    title: "Application Tracking",
    description: "Track hiring progress from application to onboarding.",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    title: "Secure Authentication",
    description: "JWT authentication with role-based access control.",
    icon: <SecurityIcon />,
  },
  {
    title: "Microservice Architecture",
    description: "Built using scalable distributed services architecture.",
    icon: <DatasetLinkedIcon />,
  },
  {
    title: "AI Hiring Automation",
    description: "Reduce manual screening and improve recruitment efficiency.",
    icon: <AutoAwesomeIcon />,
  },
];

const timeline = [
  "Register as Candidate or Recruiter",
  "Create Profile or Post Jobs",
  "AI Screening & Matching",
  "Interview & Hire",
];

const recruiterBenefits = [
  "Reduce hiring time",
  "Better candidate quality",
  "AI ranking",
  "Automated workflows",
  "Centralized hiring dashboard",
];

const candidateBenefits = [
  "Personalized job recommendations",
  "Resume optimization",
  "Application tracking",
  "Better visibility to recruiters",
  "Career growth opportunities",
];

const testimonials = [
  {
    quote:
      "HirePilot brings structure to our early screening process and helps the team focus on qualified conversations.",
    name: "Priya N.",
    role: "Talent Acquisition Lead",
  },
  {
    quote:
      "The candidate journey feels clear. I can keep my profile, resume, and applications moving without guesswork.",
    name: "Arjun M.",
    role: "Product Engineer",
  },
  {
    quote:
      "It gives recruiters the right signals quickly while still keeping the hiring workflow easy to manage.",
    name: "Meera S.",
    role: "Hiring Manager",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

function MotionBox({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <Box
      component={motion.div}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </Box>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <Stack spacing={1.25} sx={{ mb: 4, maxWidth: 760 }}>
      <Chip label={eyebrow} color="primary" variant="outlined" sx={{ alignSelf: "flex-start" }} />
      <Typography variant="h2" component="h2">
        {title}
      </Typography>
      {description ? (
        <Typography color="text.secondary" sx={{ fontSize: "1.05rem" }}>
          {description}
        </Typography>
      ) : null}
    </Stack>
  );
}

function CheckList({ items }: { items: string[] }) {
  return (
    <Stack spacing={1.25}>
      {items.map((item) => (
        <Stack key={item} direction="row" spacing={1} alignItems="center">
          <CheckCircleIcon color="primary" fontSize="small" />
          <Typography>{item}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export function LandingPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(getDashboardPath(role), { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  return (
    <>
      <SEO
        title="HirePilot | AI Powered Hiring Platform"
        description="HirePilot is an AI-powered recruitment platform that helps recruiters hire faster and enables candidates to discover better career opportunities."
      />

      <Box
        component="main"
        sx={{
          bgcolor: "background.default",
          backgroundImage: isDark
            ? "linear-gradient(180deg, rgba(17,99,255,0.16), rgba(16,19,22,0) 38%)"
            : "linear-gradient(180deg, rgba(17,99,255,0.12), rgba(246,248,251,0) 42%)",
        }}
      >
        <Box component="section" sx={{ py: { xs: 6, md: 9 }, overflow: "hidden" }}>
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "grid",
                gap: { xs: 4, lg: 6 },
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.92fr) minmax(0, 1.08fr)" },
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Stack spacing={3} sx={{ minWidth: 0, width: "100%", maxWidth: { xs: "calc(100vw - 64px)", sm: "100%" } }}>
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="AI recruiting intelligence for modern teams"
                  color="primary"
                  variant="outlined"
                  sx={{ alignSelf: "flex-start", bgcolor: alpha(theme.palette.primary.main, 0.08) }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2.2rem", sm: "3rem", md: "4rem" },
                    maxWidth: { xs: "calc(100vw - 64px)", sm: 780 },
                    overflowWrap: "break-word",
                  }}
                >
                  AI-Powered Hiring. Smarter Recruiting. Better Careers.
                </Typography>
                <Typography
                  component="p"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "1.02rem", md: "1.2rem" },
                    lineHeight: 1.7,
                    maxWidth: { xs: "calc(100vw - 64px)", md: 760 },
                    overflowWrap: "break-word",
                  }}
                >
                  HirePilot helps recruiters discover top talent faster and enables job seekers to find
                  opportunities that match their skills through AI-driven screening, resume intelligence,
                  and smart hiring workflows.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ width: "100%", maxWidth: { xs: "calc(100vw - 64px)", sm: "none" } }}>
                  <Button component={Link} to={ROUTES.REGISTER} size="large" variant="contained" startIcon={<PersonAddIcon />} sx={{ width: { xs: "100%", sm: "auto" } }}>
                    Register
                  </Button>
                  <Button component={Link} to={ROUTES.LOGIN} size="large" variant="outlined" startIcon={<LoginIcon />} sx={{ width: { xs: "100%", sm: "auto" } }}>
                    Login
                  </Button>
                  <Button type="button" size="large" variant="outlined" startIcon={<GoogleIcon />} onClick={startGoogleOAuth} sx={{ width: { xs: "100%", sm: "auto" } }}>
                    Continue with Google
                  </Button>
                </Stack>
                <Box
                  sx={{
                    display: "grid",
                    gap: 1,
                    gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
                    maxWidth: 680,
                  }}
                >
                  {trustIndicators.map((item) => (
                    <Stack key={item} direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="primary" fontSize="small" />
                      <Typography color="text.secondary">{item}</Typography>
                    </Stack>
                  ))}
                </Box>
              </Stack>

              <Box sx={{ position: "relative", minWidth: 0, maxWidth: { xs: "calc(100vw - 64px)", sm: "100%" } }}>
                <Box
                  component="img"
                  src="/assets/hirepilot-platform-preview.png"
                  alt="HirePilot AI hiring platform dashboard preview"
                  sx={{
                    width: "100%",
                    display: "block",
                    borderRadius: 2,
                    boxShadow: `0 30px 80px ${alpha("#0b1220", isDark ? 0.42 : 0.18)}`,
                    border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                  }}
                />
                <Stack
                  spacing={1.25}
                  sx={{
                    position: { xs: "static", md: "absolute" },
                    right: { md: 22 },
                    bottom: { md: 22 },
                    mt: { xs: 2, md: 0 },
                    width: { xs: "100%", md: 280 },
                  }}
                >
                  {heroStats.map((stat) => (
                    <Box
                      key={stat}
                      sx={{
                        px: 2,
                        py: 1.3,
                        borderRadius: 2,
                        backdropFilter: "blur(18px)",
                        bgcolor: alpha(theme.palette.background.paper, 0.94),
                        border: `1px solid ${alpha(theme.palette.common.white, isDark ? 0.12 : 0.7)}`,
                        boxShadow: `0 18px 34px ${alpha("#0b1220", 0.12)}`,
                      }}
                    >
                      <Typography fontWeight={800}>{stat}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Container>
        </Box>

        <Box component="section" id="about" sx={{ py: { xs: 4, md: 5 }, bgcolor: alpha(theme.palette.primary.main, 0.07) }}>
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1.1fr repeat(4, 1fr)" },
                alignItems: "center",
              }}
            >
              <Typography variant="h4" component="p">
                Trusted by modern teams to hire better
              </Typography>
              {[
                ["500+", "Companies", <ApartmentIcon />],
                ["50K+", "Hires Made", <GroupsIcon />],
                ["70%", "Time Saved", <TrendingUpIcon />],
                ["98%", "Satisfaction", <SecurityIcon />],
              ].map(([value, label, icon]) => (
                <Stack key={String(label)} direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ color: "primary.main", display: "grid" }}>{icon}</Box>
                  <Box>
                    <Typography variant="h3" component="p">
                      {value}
                    </Typography>
                    <Typography color="text.secondary">{label}</Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="xl">
            <SectionHeading
              eyebrow="Role Selection"
              title="Choose Your Journey"
              description="HirePilot gives candidates and recruiters focused workflows built around their goals."
            />
            <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
              {journeys.map((journey, index) => (
                <MotionBox key={journey.title} delay={index * 0.08}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -6 }}
                    variant="outlined"
                    sx={{
                      height: "100%",
                      overflow: "hidden",
                      background:
                        index === 0
                          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.14)}, ${alpha(theme.palette.background.paper, 0.88)})`
                          : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.16)}, ${alpha(theme.palette.background.paper, 0.88)})`,
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                      <Stack spacing={2.5}>
                        <Box
                          sx={{
                            width: 50,
                            height: 50,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: 2,
                            color: "primary.contrastText",
                            bgcolor: index === 0 ? "primary.main" : "secondary.main",
                          }}
                        >
                          {journey.icon}
                        </Box>
                        <Typography variant="h3" component="h3">
                          {journey.title}
                        </Typography>
                        <CheckList items={journey.points} />
                        <Button component={Link} to={journey.to} variant="contained" size="large" sx={{ alignSelf: "flex-start" }}>
                          {journey.cta}
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </MotionBox>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="section" id="features" sx={{ py: { xs: 7, md: 10 }, bgcolor: alpha(theme.palette.background.paper, 0.58) }}>
          <Container maxWidth="xl">
            <SectionHeading
              eyebrow="Platform Features"
              title="Recruiting workflows built for speed, clarity, and scale"
            />
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" } }}>
              {features.map((feature, index) => (
                <MotionBox key={feature.title} delay={index * 0.04}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={1.5}>
                        <Box sx={{ color: "primary.main", display: "grid" }}>{feature.icon}</Box>
                        <Typography variant="h4" component="h3">
                          {feature.title}
                        </Typography>
                        <Typography color="text.secondary">{feature.description}</Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </MotionBox>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="xl">
            <SectionHeading eyebrow="How It Works" title="From signup to hiring decision in four focused steps" />
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(4, minmax(0, 1fr))" } }}>
              {timeline.map((step, index) => (
                <Card key={step} variant="outlined" sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={1.5}>
                      <Typography color="primary" fontWeight={800}>
                        Step {index + 1}
                      </Typography>
                      <Typography variant="h4" component="h3">
                        {step}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: alpha(theme.palette.primary.main, 0.06) }}>
          <Container maxWidth="xl">
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" } }}>
              <Card id="recruiters" variant="outlined">
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2}>
                    <Chip icon={<BusinessCenterIcon />} label="For Recruiters" color="primary" sx={{ alignSelf: "flex-start" }} />
                    <Typography variant="h2" component="h2">
                      Hire with sharper signals and fewer manual loops
                    </Typography>
                    <CheckList items={recruiterBenefits} />
                  </Stack>
                </CardContent>
              </Card>
              <Card id="candidates" variant="outlined">
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack spacing={2}>
                    <Chip icon={<RocketLaunchIcon />} label="For Candidates" color="primary" sx={{ alignSelf: "flex-start" }} />
                    <Typography variant="h2" component="h2">
                      Find better opportunities with a smarter profile
                    </Typography>
                    <CheckList items={candidateBenefits} />
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>

        <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="xl">
            <SectionHeading eyebrow="Testimonials" title="Built for teams and talent who want hiring to feel clearer" />
            <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" } }}>
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} variant="outlined" sx={{ height: "100%" }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Typography color="text.secondary">"{testimonial.quote}"</Typography>
                      <Box>
                        <Typography fontWeight={800}>{testimonial.name}</Typography>
                        <Typography color="text.secondary">{testimonial.role}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        <Box component="footer" sx={{ py: 5, bgcolor: isDark ? "#0b0f14" : "#eef4ff" }}>
          <Container maxWidth="xl">
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "1.4fr repeat(5, 1fr)" } }}>
              <Stack spacing={1.5}>
                <Box component="img" src="/assets/hirepilot-logo.png" alt="HirePilot" sx={{ width: 42, height: 42 }} />
                <Typography variant="h4" component="p">
                  HirePilot
                </Typography>
                <Typography color="text.secondary">AI powered hiring for recruiters and candidates.</Typography>
              </Stack>
              {["Company", "Features", "Recruiters", "Candidates", "Contact"].map((heading) => (
                <Stack key={heading} spacing={1}>
                  <Typography fontWeight={800}>{heading}</Typography>
                  {["Overview", "Resources", "Support"].map((item) => (
                    <Typography key={item} component="a" href="/" color="text.secondary">
                      {item}
                    </Typography>
                  ))}
                </Stack>
              ))}
            </Box>
            <Divider sx={{ my: 3 }} />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
              <Typography color="text.secondary">© {new Date().getFullYear()} HirePilot. All rights reserved.</Typography>
              <Stack direction="row" spacing={2}>
                <Typography component="a" href="/" color="text.secondary">
                  Privacy Policy
                </Typography>
                <Typography component="a" href="/" color="text.secondary">
                  Terms of Service
                </Typography>
                <Typography component="a" href="/" color="text.secondary">
                  Social
                </Typography>
              </Stack>
            </Stack>
          </Container>
        </Box>
      </Box>
    </>
  );
}
