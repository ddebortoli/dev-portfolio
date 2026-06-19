import React, { useState, useEffect, useContext } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container, Badge, Button, Spinner,
} from 'react-bootstrap';
import { ThemeContext } from 'styled-components';
import ReactMarkdown from 'react-markdown';
import endpoints from '../constants/endpoints';

const styles = {
  root: {
    paddingTop: '2rem',
    paddingBottom: '4rem',
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    marginBottom: '1.5rem',
    cursor: 'pointer',
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  hero: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: '1.5rem',
    objectFit: 'cover',
  },
  heroPlaceholder: {
    width: '100%',
    height: 280,
    borderRadius: 12,
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
    fontSize: 40,
    color: '#7F77DD',
    opacity: 0.4,
  },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    margin: 0,
  },
  statusBadge: {
    fontSize: 10,
    padding: '3px 10px',
    borderRadius: 99,
    fontWeight: 500,
    marginTop: 6,
    whiteSpace: 'nowrap',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: '1.25rem',
    lineHeight: 1.7,
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: '1.25rem',
  },
  tag: {
    fontSize: 11,
    fontWeight: 500,
    padding: '3px 10px',
    borderRadius: 99,
    margin: 0,
  },
  btns: {
    display: 'flex',
    gap: 8,
    marginBottom: '2rem',
  },
  btn: {
    fontSize: 13,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  },
  divider: {
    margin: '1.75rem 0',
    opacity: 0.15,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '0.75rem',
    opacity: 0.5,
  },
  descText: {
    fontSize: 15,
    lineHeight: 1.8,
  },
  screenshots: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  screenshotFrame: {
    flex: '0 0 auto',
    borderRadius: 10,
    overflow: 'hidden',
    border: '0.5px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.03)',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    boxSizing: 'border-box',
    justifySelf: 'center',
  },
  screenshotImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    border: 'none',
  },
  mobileFrame: {
    aspectRatio: '9 / 16',
    width: 'min(100%, 260px)',
  },
  tabletFrame: {
    aspectRatio: '4 / 3',
    width: 'min(100%, 360px)',
  },
  desktopFrame: {
    aspectRatio: '16 / 9',
    width: 'min(100%, 520px)',
  },
  videoWrapper: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    borderRadius: 12,
    overflow: 'hidden',
    border: '0.5px solid rgba(255,255,255,0.08)',
  },
  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
};

const statusVariant = {
  open: 'success',
  private: 'primary',
  wip: 'warning',
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const history = useHistory();
  const theme = useContext(ThemeContext);
  const [project, setProject] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const resolveAssetUrl = (url) => {
    if (!url) return null;
    if (typeof url !== 'string') return null;
    if (/^https?:\/\//i.test(url)) return url;
    if (url.startsWith('/')) return url;
    // Treat as public/-relative when no leading slash is provided.
    return `/${url}`;
  };

  const normalizeScreenshotItems = (screenshots) => {
    if (!Array.isArray(screenshots)) return [];
    return screenshots
      .map((item) => {
        if (typeof item === 'string') {
          return { src: item, type: 'desktop' };
        }
        if (item && typeof item === 'object') {
          const src = item.src || item.url || item.image || null;
          const type = item.type || item.deviceType || item.device || 'desktop';
          return src ? { src, type } : null;
        }
        return null;
      })
      .filter(Boolean);
  };

  const getScreenshotFrameStyle = (type) => {
    const normalizedType = (type || 'desktop').toLowerCase();
    if (normalizedType === 'mobile') return styles.mobileFrame;
    if (normalizedType === 'tablet') return styles.tabletFrame;
    return styles.desktopFrame;
  };

  useEffect(() => {
    // Reset states when slug changes to avoid showing stale "not found".
    setProject(null);
    setNotFound(false);

    fetch(endpoints.projects, { method: 'GET' })
      .then((res) => res.json())
      .then((res) => {
        const found = res.projects?.find((p) => p.slug === slug);
        if (found) {
          setProject(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => {
        setProject(null);
        setNotFound(true);
      });
  }, [slug]);

  if (notFound) {
    return (
      <Container style={styles.root}>
        <button
          type="button"
          style={{ ...styles.back, color: theme.bsSecondaryVariant }}
          onClick={() => history.push('/projects')}
        >
          ← Proyectos
        </button>
        <p>Proyecto no encontrado.</p>
      </Container>
    );
  }

  if (!project) {
    return (
      <Container style={{ ...styles.root, textAlign: 'center' }}>
        <Spinner animation="border" />
      </Container>
    );
  }

  const githubLink = project?.links?.find((l) => l.type === 'github');
  const demoLink = project?.links?.find((l) => l.type === 'demo');
  const statusLabel = project?.status;
  const statusColor = statusVariant[statusLabel?.toLowerCase()] || 'secondary';

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  };

  return (
    <Container style={styles.root}>

      <button
        type="button"
        style={{ ...styles.back, color: theme.bsSecondaryVariant === 'light' ? '#aaa' : '#555' }}
        onClick={() => history.push('/projects')}
      >
        ← Proyectos
      </button>

      {project.image
        ? (
          <img
            src={resolveAssetUrl(project.image)}
            alt={project.title}
            style={styles.hero}
          />
        ) : (
          <div style={styles.heroPlaceholder}>
            {'</>'}
          </div>
        )}

      <div style={styles.header}>
        <h1 style={{ ...styles.title, color: theme.color }}>{project.title}</h1>
        {statusLabel && (
          <Badge bg={statusColor} style={styles.statusBadge}>
            {statusLabel}
          </Badge>
        )}
      </div>

      {project.subtitle && (
        <p style={{ ...styles.subtitle, color: theme.bsSecondaryVariant === 'light' ? '#ccc' : '#555' }}>
          {project.subtitle}
        </p>
      )}

      <div style={styles.tags}>
        {project.tags?.map((tag) => (
          <Badge
            key={tag}
            pill
            bg={theme.bsSecondaryVariant}
            text={theme.bsPrimaryVariant}
            style={styles.tag}
          >
            {tag}
          </Badge>
        ))}
      </div>

      <div style={styles.btns}>
        {githubLink && (
          <Button
            size="sm"
            variant={'outline-' + theme.bsSecondaryVariant}
            style={styles.btn}
            onClick={() => window.open(githubLink.href, '_blank')}
          >
            GitHub
          </Button>
        )}
        {demoLink && (
          <Button
            size="sm"
            variant={'outline-' + theme.bsSecondaryVariant}
            style={styles.btn}
            onClick={() => window.open(demoLink.href, '_blank')}
          >
            ▶ Demo
          </Button>
        )}
      </div>

      <hr style={styles.divider} />

      {project.detailDescription && (
        <>
          <p style={{ ...styles.sectionTitle, color: theme.color }}>Descripción</p>
          <div style={styles.descText}>
            <ReactMarkdown>{project.detailDescription}</ReactMarkdown>
          </div>
          <hr style={styles.divider} />
        </>
      )}

      {project.screenshots?.length > 0 && (
        <>
          <p style={{ ...styles.sectionTitle, color: theme.color }}>Screenshots</p>
          <div style={styles.screenshots}>
            {normalizeScreenshotItems(project.screenshots).map((screenshot, i) => {
              const resolvedSrc = resolveAssetUrl(screenshot.src);
              return (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${screenshot.src}-${i}`}
                  style={{
                    ...styles.screenshotFrame,
                    ...getScreenshotFrameStyle(screenshot.type),
                  }}
                >
                  <img
                    src={resolvedSrc}
                    alt={`${project.title} ${screenshot.type} screenshot ${i + 1}`}
                    style={styles.screenshotImg}
                  />
                </div>
              );
            })}
          </div>
          <hr style={styles.divider} />
        </>
      )}

      {project.videoUrl && (
        <>
          <p style={{ ...styles.sectionTitle, color: theme.color }}>Demo</p>
          <div style={styles.videoWrapper}>
            <iframe
              src={getYoutubeEmbedUrl(project.videoUrl)}
              title={`${project.title} demo`}
              style={styles.videoIframe}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </>
      )}

    </Container>
  );
};

export default ProjectDetail;
