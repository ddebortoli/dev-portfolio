import React, { useContext } from 'react';
import {
  Button, Card, Badge, Col,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import ReactMarkdown from 'react-markdown';

const styles = {
  badgeStyle: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    margin: 5,
  },
  cardStyle: {
    borderRadius: 10,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  cardTitleStyle: {
    fontSize: 20,
    fontWeight: 700,
  },
  cardTextStyle: {
    textAlign: 'left',
    fontSize: 14,
  },
  buttonStyle: {
    margin: 5,
    fontSize: 13,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  },
  primaryButtonStyle: {
    margin: 5,
    marginLeft: 'auto',
    fontSize: 13,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
  },
  statusBadgeStyle: {
    fontSize: 10,
    padding: '3px 10px',
    borderRadius: 99,
    fontWeight: 500,
  },
  headerStyle: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 8,
  },
  imgPlaceholder: {
    width: '100%',
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%)',
    color: '#7F77DD',
    fontSize: 48,
  },
  buttonRowStyle: {
    paddingTop: 0,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
};

const statusVariant = {
  open: 'success',
  private: 'primary',
  wip: 'warning',
};

const GitHubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.65 1.66.25 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ProjectCard = (props) => {
  const theme = useContext(ThemeContext);
  const { project } = props;

  if (!project) return null;

  const parseBodyText = (text) => <ReactMarkdown>{text}</ReactMarkdown>;

  const githubLink = project?.links?.find((l) => l.type === 'github');
  const demoLink = project?.links?.find((l) => l.type === 'demo');
  const { detailUrl } = project;

  const statusLabel = project?.status;
  const statusColor = statusVariant[statusLabel?.toLowerCase()] || 'secondary';

  return (
    <Col className="d-flex">
      <Card
        style={{
          ...styles.cardStyle,
          backgroundColor: theme.cardBackground,
          borderColor: theme.cardBorderColor,
        }}
        text={theme.bsSecondaryVariant}
      >
        {project?.image
          ? (
            <Card.Img
              variant="top"
              src={project.image}
              style={{ height: 180, objectFit: 'cover' }}
            />
          ) : (
            <div style={styles.imgPlaceholder}>
              <span style={{ fontSize: 40, opacity: 0.4 }}>{'</>'}</span>
            </div>
          )}

        <Card.Body style={{ flex: 1 }}>
          <div style={styles.headerStyle}>
            <Card.Title style={styles.cardTitleStyle}>{project.title}</Card.Title>
            {statusLabel && (
              <Badge
                bg={statusColor}
                style={styles.statusBadgeStyle}
              >
                {statusLabel}
              </Badge>
            )}
          </div>
          <Card.Text style={styles.cardTextStyle}>
            {parseBodyText(project.bodyText)}
          </Card.Text>
        </Card.Body>

        <Card.Body style={styles.buttonRowStyle}>
          {githubLink && (
            <Button
              style={styles.buttonStyle}
              variant={'outline-' + theme.bsSecondaryVariant}
              onClick={() => window.open(githubLink.href, '_blank')}
            >
              <GitHubIcon />
              GitHub
            </Button>
          )}
          {demoLink && (
            <Button
              style={styles.buttonStyle}
              variant={'outline-' + theme.bsSecondaryVariant}
              onClick={() => window.open(demoLink.href, '_blank')}
            >
              ▶ Demo
            </Button>
          )}
          {detailUrl && (
            <Button
              style={styles.primaryButtonStyle}
              variant={theme.bsSecondaryVariant}
              onClick={() => window.open(detailUrl, '_blank')}
            >
              Ver detalle →
            </Button>
          )}
        </Card.Body>

        {project.tags && (
          <Card.Footer style={{ backgroundColor: theme.cardFooterBackground }}>
            {project.tags.map((tag) => (
              <Badge
                key={tag}
                pill
                bg={theme.bsSecondaryVariant}
                text={theme.bsPrimaryVariant}
                style={styles.badgeStyle}
              >
                {tag}
              </Badge>
            ))}
          </Card.Footer>
        )}
      </Card>
    </Col>
  );
};

ProjectCard.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string.isRequired,
    bodyText: PropTypes.string.isRequired,
    image: PropTypes.string,
    status: PropTypes.string,
    detailUrl: PropTypes.string,
    links: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['github', 'demo', 'detail']),
    })),
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default ProjectCard;
