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
            ? "linear-gradient(180deg, rgba(45,212,191,0.12), rgba(16,19,22,0) 45%)"
            : "linear-gradient(180deg, rgba(15,118,110,0.08), rgba(246,248,251,0) 50%)",
        }}
      >
        <Box component="section" sx={{ py: { xs: 5, md: 10 }, overflow: "hidden" }}>
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "grid",
                gap: { xs: 5, lg: 6 },
                gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 0.95fr) minmax(0, 1.05fr)" },
                alignItems: "center",
                minWidth: 0,
              }}
            >
              <Stack spacing={3.5} sx={{ minWidth: 0, width: "100%", px: { xs: 1.5, sm: 0 } }}>
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="AI recruiting intelligence for modern teams"
                  color="primary"
                  variant="outlined"
                  sx={{
                    alignSelf: "flex-start",
                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                    fontWeight: 600,
                    px: 1,
                    py: 2,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" }
                  }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: { xs: "2.3rem", sm: "3.2rem", md: "4.2rem" },
                    fontWeight: 900,
                    lineHeight: { xs: 1.2, sm: 1.15 },
                    maxWidth: { xs: "100%", sm: 780 },
                    overflowWrap: "break-word",
                    background: isDark
                      ? "linear-gradient(135deg, #2dd4bf 0%, #fbbf24 100%)"
                      : "linear-gradient(135deg, #0f766e 0%, #2ca99b 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  AI-Powered Hiring. Smarter Recruiting. Better Careers.
                </Typography>
                <Typography
                  component="p"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "1.02rem", md: "1.2rem" },
                    lineHeight: 1.65,
                    maxWidth: { xs: "100%", md: 760 },
                    overflowWrap: "break-word",
                  }}
                >
                  HirePilot helps recruiters discover top talent faster and enables job seekers to find
                  opportunities that match their skills through AI-driven screening, resume intelligence,
                  and smart hiring workflows.
                </Typography>
                
                {/* Responsive Button Layout */}
                <Stack
                  direction="column"
                  spacing={1.5}
                  sx={{
                    width: "100%",
                    maxWidth: { xs: "100%", sm: "none" },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    sx={{ width: "100%" }}
                  >
                    <Button
                      component={Link}
                      to={ROUTES.REGISTER}
                      size="large"
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      sx={{
                        flex: 1,
                        width: { sm: "auto" },
                        borderRadius: "100px",
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, isDark ? 0.3 : 0.15)}`,
                        fontWeight: 700,
                        py: { xs: 1.5, sm: 1.8 },
                        fontSize: { xs: "0.95rem", sm: "1rem" },
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: `0 12px 28px ${alpha(theme.palette.primary.main, isDark ? 0.4 : 0.25)}`,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Register
                    </Button>
                    <Button
                      component={Link}
                      to={ROUTES.LOGIN}
                      size="large"
                      variant="outlined"
                      startIcon={<LoginIcon />}
                      sx={{
                        flex: 1,
                        width: { sm: "auto" },
                        borderRadius: "100px",
                        fontWeight: 700,
                        py: { xs: 1.5, sm: 1.8 },
                        fontSize: { xs: "0.95rem", sm: "1rem" },
                        borderColor: theme.palette.divider,
                        "&:hover": {
                          transform: "translateY(-2px)",
                          bgcolor: alpha(theme.palette.text.primary, 0.04),
                          borderColor: theme.palette.text.primary,
                        },
                        transition: "all 0.2s ease-in-out",
                      }}
                    >
                      Login
                    </Button>
                  </Stack>
                  <Button
                    type="button"
                    size="large"
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={startGoogleOAuth}
                    sx={{
                      width: "100%",
                      borderRadius: "100px",
                      fontWeight: 600,
                      color: "text.primary",
                      borderColor: theme.palette.divider,
                      py: { xs: 1.5, sm: 1.8 },
                      fontSize: { xs: "0.95rem", sm: "1rem" },
                      "&:hover": {
                        transform: "translateY(-2px)",
                        bgcolor: alpha(theme.palette.text.primary, 0.04),
                        borderColor: theme.palette.text.primary,
                      },
                      transition: "all 0.2s ease-in-out",
                      alignSelf: { sm: "flex-start" },
                    }}
                  >
                    Continue with Google
                  </Button>
                </Stack>

                {/* 2-column checklist on mobile */}
                <Box
                  sx={{
                    display: "grid",
                    gap: 1.5,
                    gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(2, minmax(0, 1fr))" },
                    maxWidth: 680,
                    width: "100%",
                    pt: 1,
                  }}
                >
                  {trustIndicators.map((item) => (
                    <Stack key={item} direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon color="primary" fontSize="small" sx={{ flexShrink: 0 }} />
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.85rem", sm: "0.95rem" }, fontWeight: 500 }}
                      >
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Box>
              </Stack>

              {/* Preview Image with Browser Mockup */}
              <Box sx={{ position: "relative", minWidth: 0, width: "100%", px: { xs: 1.5, sm: 0 } }}>
                <Box
                  sx={{
                    borderTop: `28px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                    borderLeft: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                    borderRight: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                    borderBottom: `1px solid ${isDark ? "#27272a" : "#e2e8f0"}`,
                    borderRadius: "12px",
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: `0 30px 80px ${alpha("#0b1220", isDark ? 0.5 : 0.2)}`,
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: -20,
                      left: 12,
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: "#ef4444",
                      boxShadow: "14px 0 0 #f59e0b, 28px 0 0 #10b981",
                      zIndex: 10,
                    },
                  }}
                >
                  <Box
                    component="img"
                    src="/assets/hirepilot-platform-preview.png"
                    alt="HirePilot AI hiring platform dashboard preview"
                    sx={{
                      width: "100%",
                      display: "block",
                      transition: "transform 0.5s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.02)",
                      },
                    }}
                  />
                </Box>

                {/* Floating Stats - hidden on mobile/tablet to reduce visual noise */}
                <Stack
                  spacing={1.25}
                  sx={{
                    position: "absolute",
                    right: 22,
                    bottom: 22,
                    width: 280,
                    display: { xs: "none", md: "flex" },
                  }}
                >
                  {heroStats.map((stat) => (
                    <Box
                      key={stat}
                      sx={{
                        px: 2.5,
                        py: 1.5,
                        borderRadius: 2,
                        backdropFilter: "blur(18px)",
                        bgcolor: alpha(theme.palette.background.paper, 0.94),
                        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
                        boxShadow: `0 18px 34px ${alpha("#0b1220", 0.15)}`,
                        transform: "translateY(0)",
                        transition: "all 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          borderColor: "primary.main",
                        },
                      }}
                    >
                      <Typography fontWeight={800} fontSize="0.95rem">{stat}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Stats section - Clean 2x2 grid on mobile */}
        <Box
          component="section"
          id="about"
          sx={{
            py: 5,
            bgcolor: alpha(theme.palette.primary.main, 0.04),
            borderTop: `1px solid ${theme.palette.divider}`,
            borderBottom: `1px solid ${theme.palette.divider}`
          }}
        >
          <Container maxWidth="xl">
            <Box
              sx={{
                display: "grid",
                gap: { xs: 4, md: 2 },
                gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "1.1fr repeat(4, 1fr)" },
                alignItems: "center",
              }}
            >
              <Typography
                variant="h4"
                component="p"
                sx={{
                  gridColumn: { xs: "span 2", md: "span 1" },
                  textAlign: { xs: "center", md: "left" },
                  fontWeight: 800,
                  mb: { xs: 1, md: 0 },
                  fontSize: { xs: "1.25rem", md: "1.45rem" }
                }}
              >
                Trusted by modern teams to hire better
              </Typography>
              {[
                ["500+", "Companies", <ApartmentIcon />],
                ["50K+", "Hires Made", <GroupsIcon />],
                ["70%", "Time Saved", <TrendingUpIcon />],
                ["98%", "Satisfaction", <SecurityIcon />],
              ].map(([value, label, icon]) => (
                <Stack
                  key={String(label)}
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{
                    justifyContent: { xs: "center", md: "flex-start" },
                  }}
                >
                  <Box sx={{ color: "primary.main", display: "grid", transform: "scale(1.1)" }}>{icon}</Box>
                  <Box>
                    <Typography variant="h3" component="p" sx={{ fontWeight: 800, fontSize: { xs: "1.5rem", md: "1.875rem" } }}>
                      {value}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>
                      {label}
                    </Typography>
                  </Box>
                </Stack>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Role selection section */}
        <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="xl">
            <SectionHeading
              eyebrow="Role Selection"
              title="Choose Your Journey"
              description="HirePilot gives candidates and recruiters focused workflows built around their goals."
            />
            <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" } }}>
              {journeys.map((journey, index) => (
                <MotionBox key={journey.title} delay={index * 0.08}>
                  <Card
                    component={motion.div}
                    whileHover={{ y: -8 }}
                    variant="outlined"
                    sx={{
                      height: "100%",
                      overflow: "hidden",
                      transition: "all 0.3s ease",
                      background:
                        index === 0
                          ? `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(theme.palette.background.paper, 0.88)})`
                          : `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.12)}, ${alpha(theme.palette.background.paper, 0.88)})`,
                      boxShadow: `0 16px 36px ${alpha("#000", isDark ? 0.25 : 0.04)}`,
                    }}
                  >
                    <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
                      <Stack spacing={3}>
                        <Box
                          sx={{
                            width: 52,
                            height: 52,
                            display: "grid",
                            placeItems: "center",
                            borderRadius: "12px",
                            color: "primary.contrastText",
                            bgcolor: index === 0 ? "primary.main" : "secondary.main",
                            boxShadow: `0 6px 16px ${alpha(index === 0 ? theme.palette.primary.main : theme.palette.secondary.main, 0.35)}`,
                          }}
                        >
                          {journey.icon}
                        </Box>
                        <Typography variant="h3" component="h3" sx={{ fontWeight: 800 }}>
                          {journey.title}
                        </Typography>
                        <CheckList items={journey.points} />
                        <Button
                          component={Link}
                          to={journey.to}
                          variant="contained"
                          size="large"
                          sx={{
                            alignSelf: "flex-start",
                            borderRadius: "100px",
                            px: 3.5,
                            py: 1.25,
                            fontWeight: 700,
                            bgcolor: index === 0 ? "primary.main" : "secondary.main",
                            color: index === 0 ? "primary.contrastText" : "secondary.contrastText",
                            "&:hover": {
                              bgcolor: index === 0 ? "primary.dark" : "secondary.dark",
                            }
                          }}
                        >
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

        {/* Features section - Side-by-side row-style list layout on mobile */}
        <Box component="section" id="features" sx={{ py: { xs: 7, md: 10 }, bgcolor: alpha(theme.palette.background.paper, 0.58) }}>
          <Container maxWidth="xl">
            <SectionHeading
              eyebrow="Platform Features"
              title="Recruiting workflows built for speed, clarity, and scale"
            />
            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
              }}
            >
              {features.map((feature, index) => (
                <MotionBox key={feature.title} delay={index * 0.04}>
                  <Card
                    variant="outlined"
                    sx={{
                      height: "100%",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        boxShadow: `0 12px 30px ${alpha(theme.palette.primary.main, 0.06)}`,
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack
                        direction={{ xs: "row", sm: "column" }}
                        spacing={2.5}
                        alignItems={{ xs: "flex-start", sm: "stretch" }}
                      >
                        <Box
                          sx={{
                            color: "primary.main",
                            display: "grid",
                            p: 1.25,
                            borderRadius: "10px",
                            bgcolor: alpha(theme.palette.primary.main, 0.08),
                            alignSelf: "flex-start",
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Stack spacing={1} sx={{ flex: 1 }}>
                          <Typography variant="h4" component="h3" sx={{ fontWeight: 700 }}>
                            {feature.title}
                          </Typography>
                          <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.55 }}>
                            {feature.description}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </MotionBox>
              ))}
            </Box>
          </Container>
        </Box>

        {/* How it works section - 2x2 grid on mobile */}
        <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="xl">
            <SectionHeading eyebrow="How It Works" title="From signup to hiring decision in four focused steps" />
            <Box
              sx={{
                display: "grid",
                gap: 2.5,
                gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, minmax(0, 1fr))" },
              }}
            >
              {timeline.map((step, index) => (
                <Card
                  key={step}
                  variant="outlined"
                  sx={{
                    height: "100%",
                    position: "relative",
                    overflow: "visible",
                    "&::before": {
                      content: `"${index + 1}"`,
                      position: "absolute",
                      top: -12,
                      right: 12,
                      fontSize: "3.5rem",
                      fontWeight: 900,
                      color: alpha(theme.palette.primary.main, 0.06),
                      lineHeight: 1,
                      pointerEvents: "none",
                    },
                  }}
                >
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack spacing={1}>
                      <Typography color="primary" fontWeight={800} variant="subtitle2" sx={{ letterSpacing: "0.05em", textTransform: "uppercase" }}>
                        Step {index + 1}
                      </Typography>
                      <Typography variant="h4" component="h3" sx={{ fontWeight: 700, fontSize: { xs: "0.95rem", sm: "1.1rem" } }}>
                        {step}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Container>
        </Box>

        {/* Audience benefits */}
        <Box component="section" sx={{ py: { xs: 7, md: 10 }, bgcolor: alpha(theme.palette.primary.main, 0.04) }}>
          <Container maxWidth="xl">
            <Box sx={{ display: "grid", gap: 3.5, gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" } }}>
              <Card id="recruiters" variant="outlined" sx={{ boxShadow: `0 16px 36px ${alpha("#000", isDark ? 0.2 : 0.03)}` }}>
                <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
                  <Stack spacing={2.5}>
                    <Chip icon={<BusinessCenterIcon />} label="For Recruiters" color="primary" sx={{ alignSelf: "flex-start", fontWeight: 600 }} />
                    <Typography variant="h2" component="h2" sx={{ fontWeight: 800 }}>
                      Hire with sharper signals and fewer manual loops
                    </Typography>
                    <CheckList items={recruiterBenefits} />
                  </Stack>
                </CardContent>
              </Card>
              <Card id="candidates" variant="outlined" sx={{ boxShadow: `0 16px 36px ${alpha("#000", isDark ? 0.2 : 0.03)}` }}>
                <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
                  <Stack spacing={2.5}>
                    <Chip icon={<RocketLaunchIcon />} label="For Candidates" color="primary" sx={{ alignSelf: "flex-start", fontWeight: 600 }} />
                    <Typography variant="h2" component="h2" sx={{ fontWeight: 800 }}>
                      Find better opportunities with a smarter profile
                    </Typography>
                    <CheckList items={candidateBenefits} />
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Container>
        </Box>

        {/* Testimonials - Swipable list on mobile */}
        <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
          <Container maxWidth="xl">
            <SectionHeading eyebrow="Testimonials" title="Built for teams and talent who want hiring to feel clearer" />
            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                overflowX: { xs: "auto", md: "visible" },
                scrollSnapType: { xs: "x mandatory", md: "none" },
                pb: { xs: 3, md: 0 },
                px: { xs: 0.5, md: 0 },
                "&::-webkit-scrollbar": { display: "none" },
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}
            >
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.name}
                  variant="outlined"
                  sx={{
                    flex: { xs: "0 0 85%", sm: "0 0 45%", md: 1 },
                    scrollSnapAlign: "center",
                    height: "100%",
                    boxShadow: `0 12px 30px ${alpha("#000", isDark ? 0.2 : 0.03)}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 16px 36px ${alpha(theme.palette.primary.main, 0.06)}`,
                    },
                  }}
                >
                  <CardContent sx={{ p: { xs: 3.5, md: 4 } }}>
                    <Stack spacing={3} sx={{ height: "100%", justifyContent: "space-between" }}>
                      <Typography
                        color="text.primary"
                        sx={{
                          fontSize: { xs: "1rem", md: "1.05rem" },
                          fontStyle: "italic",
                          lineHeight: 1.6,
                          fontWeight: 500,
                        }}
                      >
                        "{testimonial.quote}"
                      </Typography>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 44,
                            height: 44,
                            borderRadius: "50%",
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            color: "primary.main",
                            display: "grid",
                            placeItems: "center",
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          }}
                        >
                          {testimonial.name[0]}
                        </Box>
                        <Box>
                          <Typography fontWeight={800} color="text.primary">
                            {testimonial.name}
                          </Typography>
                          <Typography color="text.secondary" variant="body2">
                            {testimonial.role}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Box>
            
            {/* Mobile swipe helper indicator */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: { xs: "block", md: "none" },
                textAlign: "center",
                mt: 1.5,
                fontWeight: 600,
                letterSpacing: "0.05em",
              }}
            >
              ← Swipe to read more →
            </Typography>
          </Container>
        </Box>

        <Box component="footer" sx={{ py: 6, bgcolor: isDark ? "#0b0f14" : "#eef4ff" }}>
          <Container maxWidth="xl">
            <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "1.4fr repeat(5, 1fr)" } }}>
              <Stack spacing={2}>
                <Box component="img" src="/assets/hirepilot-logo.png" alt="HirePilot" sx={{ width: 44, height: 44 }} />
                <Typography variant="h4" component="p" sx={{ fontWeight: 800 }}>
                  HirePilot
                </Typography>
                <Typography color="text.secondary" variant="body2" sx={{ lineHeight: 1.5 }}>
                  AI powered hiring for recruiters and candidates.
                </Typography>
              </Stack>
              {["Company", "Features", "Recruiters", "Candidates", "Contact"].map((heading) => (
                <Stack key={heading} spacing={1.5}>
                  <Typography fontWeight={800} fontSize="0.95rem">{heading}</Typography>
                  {["Overview", "Resources", "Support"].map((item) => (
                    <Typography key={item} component="a" href="/" color="text.secondary" variant="body2" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                      {item}
                    </Typography>
                  ))}
                </Stack>
              ))}
            </Box>
            <Divider sx={{ my: 4 }} />
            <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between" alignItems={{ xs: "center", md: "flex-start" }}>
              <Typography color="text.secondary" variant="body2">© {new Date().getFullYear()} HirePilot. All rights reserved.</Typography>
              <Stack direction="row" spacing={3}>
                <Typography component="a" href="/" color="text.secondary" variant="body2" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                  Privacy Policy
                </Typography>
                <Typography component="a" href="/" color="text.secondary" variant="body2" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>
                  Terms of Service
                </Typography>
                <Typography component="a" href="/" color="text.secondary" variant="body2" sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}>
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
